import Mailgun from 'mailgun.js'
import formData from 'form-data'

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
      console.log(this.domain, data)
      return this.mailgun.messages.create(this.domain, data)
    } catch (error) {
      console.log('send email ERR:', error)
      return { error }
    }
  }
}

export default MailService
