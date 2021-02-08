import { Provider, ProviderResponse } from '@startupjs/mail'
import Mailgun from 'mailgun-js'

export class MailgunProvider implements Provider {
  private readonly mailgun: Mailgun.Mailgun

  constructor (settings: { apiKey: string, domain: string, testMode?: boolean }) {
    this.mailgun = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain, testMode: settings.testMode })
  }

  getName (): string {
    return 'mailgun'
  }

  async send (settings: {
    from: string
    to: string | string[]
    cc?: string
    bcc?: string
    subject: string
    inline?: NodeJS.ReadWriteStream[] | NodeJS.ReadWriteStream
    attachment?: NodeJS.ReadWriteStream[] | NodeJS.ReadWriteStream
    template: {
      text: string
      context: {
        [key: string]: any
      }
    }
  }): Promise<ProviderResponse> {
    let to: string[] = []

    if (typeof settings.to === 'string') {
      to = settings.to.split(',')
    }

    if (Array.isArray(settings.to)) {
      to = settings.to
    }

    const recipientVariables: {[key: string]: any} = {}

    to.forEach((email) => {
      recipientVariables[email] = settings.template.context
    })

    try {
      const response = await this.mailgun.messages().send({
        from: settings.from,
        to,
        ...settings.cc !== undefined ? { cc: settings.cc } : {},
        ...settings.bcc !== undefined ? { bcc: settings.bcc } : {},
        subject: settings.subject,
        ...settings.inline !== undefined ? { inline: settings.inline } : {},
        ...settings.attachment !== undefined ? { attachment: settings.attachment } : {},
        text: settings.template.text,
        'recipient-variables': recipientVariables
      })

      console.log({
        text: settings.template.text,
        'recipient-variables': recipientVariables
      })

      return {
        text: settings.template.text,
        context: recipientVariables,
        result: {
          status: 'success',
          payload: response
        }
      }
    } catch (error) {
      return {
        text: settings.template.text,
        context: recipientVariables,
        result: {
          status: 'failure',
          payload: error
        }
      }
    }
  }
}
