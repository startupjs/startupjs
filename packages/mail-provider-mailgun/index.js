const Mailgun = require('mailgun-js')
const conf = require('nconf')

class MailService {
  constructor (params) {
    if (this.instance) return this
    const { apiKey, domain } = params
    this.instance = this._initClient({ apiKey, domain })
    return this
  }

  _initClient ({ apiKey, domain }) {
    if (!apiKey) throw new Error('[@startupjs/mail-provider-mailgun] _initClient: apiKey is required')
    return new Mailgun({ apiKey, domain })
  }

  _prepareData (data) {
    const from = data.from
      || `<${data.senderEmail}>`
      || process.env.MAILGUN_FROM_ID
      || conf.get('MAILGUN_FROM_ID')

    const _data = {
      ...data,
      from,
    }

    return _data
  }

  send (data) {
    try {
      const _data = this._prepareData(data)
      return this.instance.messages().send(_data)
    } catch (error) {
      console.log('send email ERR:', error)
      return { error }
    }
  }
}

module.exports = MailService
