import { finishAuth, linkAccount } from '@startupjs/auth/server'
import nconf from 'nconf'
import axios from 'axios'
import qs from 'query-string'
import { FAILURE_LOGIN_URL, CALLBACK_LINKEDIN_URL } from '../../isomorphic'
import Provider from '../Provider'

const LITE_PROFILE_URL = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,maidenName,profilePicture(displayImage~:playableStreams))'
const EMAIL_URL = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'

export default async function loginCallback (req, res, next, config) {
  const { clientId, clientSecret, successRedirectUrl, onBeforeLoginHook } = config

  const { code } = req.query

  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: nconf.get('BASE_URL') + CALLBACK_LINKEDIN_URL,
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

    const { data: profileData } = await axios.get(LITE_PROFILE_URL, authHeaders)
    const { data: emailData } = await axios.get(EMAIL_URL, authHeaders)

    const email = emailData.elements[0]['handle~'].emailAddress
    const photos = getProfilePictures(profileData.profilePicture)

    const profile = {
      email,
      id: profileData.id,
      lastName: getName(profileData.lastName),
      firstName: getName(profileData.firstName),
      picture: photos.pop()
    }

    const provider = new Provider(req.model, profile, config)

    if (req.session.loggedIn) {
      const response = await linkAccount(req, provider)
      return res.send(response)
    } else {
      const userId = await provider.findOrCreateUser()
      finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
    }
  } catch (err) {
    console.log('[@dmapper/auth-linkedin] Error: linkedin login', err)
    return res.redirect(FAILURE_LOGIN_URL)
  }
}

function getProfilePictures (profilePictureObj) {
  const result = []
  if (!profilePictureObj) return result

  try {
    profilePictureObj['displayImage~'].elements.forEach(function (pic) {
      if (pic.authorizationMethod !== 'PUBLIC') return
      if (pic.identifiers.length === 0) return

      const url = pic.identifiers[0].identifier
      result.push({ value: url })
    })
  } catch (e) {
    return result
  }

  return result
}

function getName (nameObj) {
  var locale = nameObj.preferredLocale.language + '_' + nameObj.preferredLocale.country
  return nameObj.localized[locale]
}
