import { AUTH_URL, AUTH_TOKEN_KEY } from '../../client/constants.js'
import { SESSION_KEY } from '../../client/sessionData.js'

export function getRedirectUri (req, provider) {
  let host = req.headers.host
  const port = host.split(':')[1]
  // hack for local development of expo app.
  // When opening app in iOS emulator it uses the local IP address as a BASE_URL
  // instead of localhost. Which is a problem because the auth callback URL
  // expects 'localhost' as a host. So we need to replace the IP address with 'localhost'.
  if (/192\.168\./.test(host) || /10\./.test(host)) {
    host = 'localhost'
    host += port ? `:${port}` : ''
  }
  const baseUrl = `${req.protocol}://${host}`
  return `${baseUrl}${AUTH_URL}/${provider}/callback`
}

export function getRedirectUrlFromError (err) {
  return err.redirectUrl
}

export function redirectBackToApp (res, session, { redirectUrl, platform }) {
  if (!redirectUrl) throw Error('Redirect URL is missing. It must be passed in the state from the client')
  if (platform === 'web') {
    res.setHeader('Content-Type', 'text/html')
    res.send(`
      <script>
        localStorage.setItem('${SESSION_KEY}', '${JSON.stringify(session)}');
        window.location.href = '${redirectUrl || '/'}';
      </script>
    `)
  } else {
    const sessionEncoded = encodeURIComponent(JSON.stringify(session))
    res.redirect(`${redirectUrl}?${AUTH_TOKEN_KEY}=${sessionEncoded}`)
  }
}

export function redirectBackToAppError ({ res, err, state }) {
  const { redirectUrl, platform } = state

  if (!redirectUrl) {
    throw new Error('Redirect URL is missing. It must be passed in the state from the client')
  }
  const { redirectUrl: errRedirectUrl, message } = err

  if (platform === 'web') {
    let href = errRedirectUrl || redirectUrl
    if (message) href += `?err=${encodeURIComponent(JSON.stringify({ message }))}`
    res.setHeader('Content-Type', 'text/html')
    res.send(`
      <script>
        window.location.href = '${href}';
      </script>
    `)
  } else {
    const errEncoded = encodeURIComponent(JSON.stringify(err))
    res.redirect(`${redirectUrl}?err=${errEncoded}`)
  }
}
