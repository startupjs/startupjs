import { redlock, Redlock } from '@startupjs/backend'
import acme from 'acme-client'
import conf from 'nconf'
import forge from 'node-forge'
import tls from 'tls'

const ACME_CLIENT_EMAIL = conf.get('ACME_CLIENT_EMAIL')
const HTTP_01_TOKENS = {}
const SECURE_CONTEXTS = {}
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24

let secureContextTimeout

export function http01TokensMiddleware (req, res, next) {
  for (const tokenPath in HTTP_01_TOKENS) {
    if (req.url === tokenPath) return res.send(HTTP_01_TOKENS[tokenPath])
  }
  return next()
}

function createSecureContext (domain, credentials) {
  SECURE_CONTEXTS[domain] = tls.createSecureContext(credentials)

  if (secureContextTimeout) return

  secureContextTimeout = setTimeout(() => {
    delete SECURE_CONTEXTS[domain]
  }, 1000 * 60 * 30) // 30 min
}

export async function getSecureContext (backend, domain) {
  if (!SECURE_CONTEXTS[domain]) {
    const model = backend.createModel()
    const $$certificates = model.query('sslCertificates', { domain })
    await $$certificates.subscribe()

    const certificate = $$certificates.get()[0]
    model.close()

    if (!certificate) {
      console.log('[@startupjs/server] certificateManager: could not find certificate doc in db')
      return
    }

    const { cert, key } = certificate
    createSecureContext(domain, { cert, key })
  }

  return SECURE_CONTEXTS[domain]
}

async function validateCertificate (certificate) {
  const certificateObject = forge.pki.certificateFromPem(certificate)
  const expirationDate = certificateObject.validity.notAfter

  const currentDate = new Date()
  const timeDiff = expirationDate.getTime() - currentDate.getTime()
  const daysUntilExpiration = Math.ceil(timeDiff / ONE_DAY_IN_MS)

  return daysUntilExpiration >= 3
}

async function createOrUpdateCertificate (backend, domain) {
  try {
    // lock for 1 min
    const lock = redlock.lock(`createOrUpdateCertificate:${domain}`, 1000 * 60)

    const model = backend.createModel()

    async function done () {
      try {
        await lock.unlock()
      } catch (err) {}
      model.close()
    }

    const $$certificates = model.query('sslCertificates', { domain })
    await $$certificates.subscribe()

    const certificate = $$certificates.get()[0]

    const isCertificateValid = certificate && validateCertificate(certificate.cert)

    if (isCertificateValid) {
      await done()
      return
    }

    const client = new acme.Client({
      directoryUrl: process.env.NODE_ENV === 'production' ? acme.directory.letsencrypt.production : acme.directory.letsencrypt.staging,
      accountKey: await acme.crypto.createPrivateKey()
    })

    const [key, csr] = await acme.crypto.createCsr({ commonName: domain })

    const autoParams = {
      csr,
      termsOfServiceAgreed: true,
      challengeCreateFn: async (authz, challenge, keyAuthorization) => {
        if (challenge.type === 'http-01') {
          HTTP_01_TOKENS[`/.well-known/acme-challenge/${challenge.token}`] = keyAuthorization
        } else if (challenge.type === 'dns-01') {
          console.log('[@startupjs/server] certificateManager: dns-01 challenge is not supported')
        }
      },
      challengeRemoveFn: async (authz, challenge) => {
        if (challenge.type === 'http-01') {
          delete HTTP_01_TOKENS[`/.well-known/acme-challenge/${challenge.token}`]
        } else if (challenge.type === 'dns-01') {
          console.log('[@startupjs/server] certificateManager: dns-01 challenge is not supported')
        }
      }
    }

    if (ACME_CLIENT_EMAIL) autoParams.email = ACME_CLIENT_EMAIL

    const { cert } = await client.auto(autoParams)

    createSecureContext(domain, { cert, key })
    if (certificate) {
      await model.setEach(`sslCertificates.${certificate.id}`, { key, cert })
    } else {
      await model.add('sslCertificates', { key, cert, domain })
    }

    await done()
  } catch (err) {
    if (!(err instanceof Redlock.LockError)) {
      console.log(`[@startupjs/server] certificateManager: failed to refresh TLS certificate for ${domain}`)
    }
  }
}

async function handleDomains (backend, domains) {
  for (const domain of domains) {
    await createOrUpdateCertificate(backend, domain)
  }
}

function setSslCertificatesAccess (backend) {
  backend.allowCreate('sslCertificates', () => false)
  backend.allowRead('sslCertificates', () => false)
  backend.allowUpdate('sslCertificates', () => false)
  backend.allowDelete('sslCertificates', () => false)
}

export async function init (backend, expressApp) {
  const domains = process.env.HTTPS_DOMAINS?.split?.(',')
  if (!domains?.length) return

  setSslCertificatesAccess(backend)
  expressApp.use(http01TokensMiddleware)

  setInterval(() => {
    handleDomains(backend, domains)
  }, ONE_DAY_IN_MS)

  await handleDomains(backend, domains)
}
