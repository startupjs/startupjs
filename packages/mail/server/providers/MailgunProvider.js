import Mailgun from 'mailgun-js'
import BaseProvider from './BaseProvider'

class MailService extends BaseProvider {
  constructor (params) {
    super(params)
    if (this.instance) return this
    const { apiKey, domain } = params
    this.instance = this._initClient({ apiKey, domain })
    return this
  }

  _initClient ({ apiKey, domain }) {
    if (!apiKey) throw new Error('[@startupjs/mail] _initClient: apiKey is required')
    return new Mailgun({ apiKey, domain })
  }

  send (data) {
    try {
      return this.instance.messages().send(data)
    } catch (error) {
      console.log('send email ERR:', error)
      return { error }
    }
  }
}

export default MailService
