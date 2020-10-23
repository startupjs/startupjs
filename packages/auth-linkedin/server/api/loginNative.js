// import { CALLBACK_NATIVE_LINKEDIN_URL } from '../../isomorphic'
// import Provider from '../Provider'

export default async function loginNative (config, req, res, next) {
  // const { code } = req.query
  // const { clientId, clientSecret, baseUrl } = config
  // const BASE_URL = baseUrl || process.env.BASE_URL

  // const body = {
  //   grant_type: 'authorization_code',
  //   code,
  //   redirect_uri: BASE_URL + CALLBACK_NATIVE_LINKEDIN_URL,
  //   client_id: clientId,
  //   client_secret: clientSecret
  // }

  // const config = {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // }

  // try {
  //   const { data } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', qs.stringify(body), config)

  //   const authHeaders = {
  //     headers: {
  //       Authorization: `Bearer ${data.access_token}`
  //     }
  //   }

  //   const { data: profileData } = await axios.get('https://api.linkedin.com/v2/me', authHeaders)
  //   const { data: emailData } = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', authHeaders)

  //   const { localizedLastName: lastName, localizedFirstName: firstName } = profileData
  //   const email = emailData.elements[0]['handle~'].emailAddress

  //   const profile = {
  //     email,
  //     lastName,
  //     firstName,
  //     id: profileData.id
  //   }

  //   const provider = new Provider(req.model, profile, auth.options)
  //   const userId = await provider.findOrCreateUser()
  //   req.session.userId = userId
  //   req.login(userId, next)
  // } catch (err) {
  //   console.log('[@startupjs/auth-linkedn] Error: linkedin login', err)
  //   return res.status(403).json({ message: 'Access denied' })
  // }
}
