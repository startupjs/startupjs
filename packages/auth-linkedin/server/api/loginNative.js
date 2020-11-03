import axios from 'axios'
import { CALLBACK_NATIVE_LINKEDIN_URL, FAILURE_LOGIN_URL } from '../../isomorphic'
import qs from 'query-string'
import Provider from '../Provider'
import nconf from 'nconf'
import { finishAuth } from '@startupjs/auth/server'

export default async function loginNative (req, res, next, config) {
  const { code } = req.query
  const { clientId, clientSecret } = config

  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: nconf.get('BASE_URL') + CALLBACK_NATIVE_LINKEDIN_URL,
    client_id: clientId,
    client_secret: clientSecret
  }

  const requestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  try {
    const { data } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', qs.stringify(body), requestConfig)

    const authHeaders = {
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    }

    const { data: profileData } = await axios.get('https://api.linkedin.com/v2/me', authHeaders)
    const { data: emailData } = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', authHeaders)

    const { localizedLastName: lastName, localizedFirstName: firstName } = profileData
    const email = emailData.elements[0]['handle~'].emailAddress

    const profile = {
      email,
      lastName,
      firstName,
      id: profileData.id
    }

    const provider = new Provider(req.model, profile)
    const userId = await provider.findOrCreateUser()

    finishAuth(req, res, userId)
  } catch (err) {
    console.log('[@dmapper/auth-linkedin] Error: linkedin login', err)
    return res.redirect(FAILURE_LOGIN_URL)
  }
}
