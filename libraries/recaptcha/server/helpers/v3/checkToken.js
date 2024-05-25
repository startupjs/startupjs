import axios from 'axios'
import nconf from 'nconf'
import { ERRORS } from '../../constants.js'

export default async function checkToken ({ token }) {
  const RECAPTCHA_SECRET_KEY = nconf.get('RECAPTCHA_SECRET_KEY')

  const { data } = await axios.get(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
  )

  if (!data.success) {
    console.error(`[@startupjs/recaptcha]: ${ERRORS[data['error-codes']]}`)
  }

  return data.success
}
