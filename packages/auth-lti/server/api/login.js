import passport from 'passport'
import { getDbSchools } from '../helpers'

export default async function (req, res, next, config) {
  let options

  if (config.collectionName) {
    options = {
      schools: await getDbSchools(req.model, config.collectionName)
    }
  }

  passport.authenticate('lti', options)(req, res, next)
}
