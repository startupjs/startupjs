import Mailgun from 'mailgun.js'
import formData from 'form-data'
import pick from 'lodash/pick.js'

let instance = null

class MailService {
  constructor ({ apiKey, domain }) {
    if (!instance) {
      const mailgunClient = new Mailgun(formData)
      this.mailgun = mailgunClient.client({ username: 'api', key: apiKey })
      this.domain = domain
      instance = this
    }
    return instance
  }

  send (data) {
    try {
      return this.mailgun.messages.create(
        this.domain,
        pick(
          data,
          [
            'from',
            'to',
            'cc',
            'bcc',
            'subject',
            'text',
            'html',
            'amp-html',
            'attachment',
            'inline',
            'template'
          ]
        )
      )
    } catch (error) {
      console.log('send email ERR:', error)
      return { error }
    }
  }
}

export default MailService
