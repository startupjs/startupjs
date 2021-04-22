import { Provider } from '@startupjs/2fa-manager/Provider'
import { send, check } from './helpers'

export default new Provider('google-authenticator', send, check)
