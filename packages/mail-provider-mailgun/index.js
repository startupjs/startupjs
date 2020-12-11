const Mailgun = require('mailgun-js')

class MailService {
  constructor (params) {
    if (this.instance) return this
    const { apiKey, domain } = params
    this.instance = this._initClient({ apiKey, domain })
    this.domain = domain
    return this
  }

  _initClient ({ apiKey, domain }) {
    if (!apiKey) throw new Error('[@startupjs/mail-provider-mailgun] _initClient: apiKey is required')
    return new Mailgun({ apiKey, domain })
  }

  _prepareData (data = {}) {
    const {
      from,
      to,
      subject,
      // html,
      providerOptions,
      text,
      inline,
      vars
    } = data

    let _data = {
      from,
      to,
      subject,
      // html,
      template: 'hello1',
      'h:X-Mailgun-Variables': JSON.stringify({
        firstName: 'Ivan Batya',
        mood: 'Template builder :D'
      })
    }

    if (providerOptions) {
      _data = { ..._data, ...providerOptions }
    }
    if (text) {
      _data.text = text
    }
    if (inline) {
      _data.inline = inline
    }
    if (vars) {
      _data['recipient-variables'] = vars
    }

    return _data
  }

  async _updateTemplate (data = {}) {
    const { name, html } = data

    html.lint()

    const result = await this.instance.put(
      `/${this.domain}/templates/${name}`,
      { description: 'new template descripton' }
    )
    return result
  }

  async _registerTemplate (data) {
    let templateName = 'hello1'

    const res = await this.instance.post(
      `/${this.domain}/templates`,
      {
        name: templateName,
        description: 'v0.0.1',
        template: data.html
      }
    )

    return res
  }

  async send (data) {
    try {
      // mailgun - getLimit
      // Limit 1000 (for now just throw err)
      // Найти эту переменную на лимит или создать константу если не найду
      const result = await this._registerTemplate(data)
      console.log(result, '<<<<<<<<<result')
      return this.instance.messages().send(this._prepareData(data))
      // return {}
    } catch (error) {
      console.log('send email ERR:', error)
      return { error }
    }
  }
}

module.exports = MailService
