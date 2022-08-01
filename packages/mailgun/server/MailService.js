import Mailgun from 'mailgun-js'

let instance = null

class MailService {
  constructor ({ apiKey, domain }) {
    if (!instance) {
      this.mailgun = new Mailgun({ apiKey, domain })
      instance = this
    }
    return instance
  }

  send (data) {
    try {
      return this.mailgun.messages().send(data)
    } catch (error) {
      console.log('send email ERR:', error)
      return { error }
    }
  }

  attachment (data) {
    try {
      return new this.mailgun.Attachment(data)
    } catch (error) {
      console.log('email attachment ERR:', error)
      return { error }
    }
  }
}

export default MailService
