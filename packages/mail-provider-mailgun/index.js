const { BaseMailProvider } = require('@startupjs/mail/server')
const formData = require('form-data')
const Mailgun = require('mailgun.js')

let instance = null

class MailService extends BaseMailProvider {
  constructor (params) {
    super('mailgun')
    if (this.instance) return this
    const { apiKey, domain } = params
    if (!apiKey) throw new Error('[@startupjs/mail-provider-mailgun]: apiKey is required')
    this.mailgun = new Mailgun(formData).client({
      username: 'api',
      key: apiKey
    })
    this.domain = domain
    instance = this
    return instance
  }

  async send (data) {
    try {
      return this.mailgun.messages.create(this.domain, data)
    } catch (error) {
      console.log('[@statupjs/mail-provider-mailgun] send:', error)
      return { error }
    }
  }
}

module.exports = MailService
