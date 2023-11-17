import axios from 'axios'
import qs from 'qs'

export default async function getGoogleIdToken ({
  code,
  clientId,
  clientSecret,
  redirectURI
}) {
  const data = qs.stringify({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI,
    grant_type: 'authorization_code'
  })

  const config = {
    method: 'post',
    url: 'https://oauth2.googleapis.com/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  }

  try {
    const res = await axios(config)
    return res.data.id_token
  } catch (error) {
    console.log('[@startupjs/auth-google] Error', error.response || error.data || error)
  }
}
