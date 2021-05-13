import axios from 'axios'
import nconf from 'nconf'

export default async function checkDataRecaptcha ({ token }) {
  const RECAPTCHA_SECRET_KEY = nconf.get('RECAPTCHA_SECRET_KEY')

  const { data } = await axios.get(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
  )

  return data
}
