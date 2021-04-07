import nconf from 'nconf'

const STAGE = nconf.get('NODE_ENV')
const WHITELIST = nconf.get('EMAIL_WHITELIST')
const isProduction = STAGE === 'production'
let emailWhitelist = []

if (WHITELIST && typeof WHITELIST === 'string') {
  emailWhitelist = WHITELIST.split(', ').filter(Boolean)
}

async function _checkUnsubscribed (model, email) {
  const $auths = model.query('auths', {
    'emailSettings.unsubscribed': true,
    email,
    $count: true
  })

  await $auths.subscribe()
  const authsCount = $auths.getExtra()
  $auths.unsubscribe()

  return !!authsCount
}

async function _checkPermission (model, email, ignoreUnsubscribed) {
  if (!isProduction && !emailWhitelist.includes(email)) {
    console.log(`\n[@startupjs/mail] We can't send email to address ("${email}") that not in whitelist in dev STAGE.\n`)
    return false
  }

  if (!ignoreUnsubscribed && await _checkUnsubscribed(model, email)) {
    console.log(`\n[@startupjs/mail] We can't send email to address ("${email}") that is unsubscribed.\n`)
    return false
  }

  return true
}

export default async function filterIgnoredEmails (model, emails, ignoreUnsubscribed) {
  let filteredEmails = []

  for (let email of emails) {
    if (await _checkPermission(model, email, ignoreUnsubscribed)) {
      filteredEmails.push(email)
    }
  }

  return filteredEmails
}
