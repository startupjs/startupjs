import FB from 'fb'
import Provider from '../Provider'
import { FIELDS, API_VERSION } from '../../isomorphic/constants'
import { finishAuth } from '@startupjs/auth/server'

export default function loginNative (req, res, next, config) {
  const { userID, accessToken } = req.body

  FB.setAccessToken(accessToken)

  FB.api(
    userID,
    { version: API_VERSION, fields: FIELDS },
    async response => {
      if (!response || response.error) {
        console.log(!response ? 'error occurred' : response.error)
        return res.status(403).json({ message: 'Access denied' })
      }

      const provider = new Provider(req.model, response, config)
      const userId = await provider.findOrCreateUser()
      finishAuth(req, res, userId)
    }
  )
}
