import conf from 'nconf'
import fs from 'fs'
import inlineCss from 'inline-css'
import MailService from './MailService'

const STAGE = process.env.STAGE
const EMAIL_WHITELIST = [...(conf.get('ADMINS') || []), ...(conf.get('EMAIL_WHITELIST') || [])]
const isProduction = STAGE === 'production'

async function getTemplate (template, options) {
  let html = fs.readFileSync(`${process.cwd()}/emails/${template}.html`, 'utf8')

  if (html && options) {
    for (const option in options) {
      html = html.replace(`{{${option}}}`, options[option])
    }
  }
  const htmlWithInlinedCss = await inlineCss(html, { url: ' ' })
  return htmlWithInlinedCss
}

/**
 * @param {Boolean} params.ignoreWhitelist
 * @param {String} params.email - Can be a single email or a comma separated string e.g 'test@abc.com, test2@def.mail'
 * @param {String} params.subject
 * @param {String} params.text
 * @param {String} params.html
 * @param {Boolean} params.inline
 * @param {String} params.templateName
 * @param {Array} params.files
 */
async function sendEmail (params) {
  const splitEmails = params.email.split(',')

  for (let email of splitEmails) {
    if (!isProduction && !EMAIL_WHITELIST.includes(email.trim()) && !params.ignoreWhitelist) {
      return console.log(`\n[@startupjs/mailgun] We can't send email to address ("${email}") that not in whitelist in dev STAGE.\n`)
    }
  }

  try {
    const apiKey = params.apiKey || process.env.MAILGUN_KEY || conf.get('MAILGUN_KEY')
    if (!apiKey) throw new Error('The mailgun key must be provided!')

    const domain = params.domain || process.env.MAILGUN_DOMAIN || conf.get('MAILGUN_DOMAIN')
    if (!domain) throw new Error('The mailgun domain must be provided!')

    const from = params.from || process.env.MAILGUN_FROM_ID || conf.get('MAILGUN_FROM_ID')

    let options = {
      from,
      to: params.email,
      subject: params.subject,
      text: params.text,
      html: params.html,
      inline: params.inline
    }

    if (params.templateName) {
      options.html = await getTemplate(params.templateName, params.templateOptions)
    }

    const mailgun = new MailService({ apiKey, domain })

    if (params.files && params.files instanceof Array) {
      options.attachment = params.files.map(data => mailgun.attachment(data))
    }

    const result = await mailgun.send(options)

    console.log(`\n[@startupjs/mailgun] | Email to ${params.email} has been sent to queue\nResult: ----->`, result)

    return result.success === false ? result : { success: true, result }
  } catch (error) {
    console.log(`\n[@startupjs/mailgun] | Emailing to ${params.email} failed\nResult: ---->`, error.message, error)
    return { success: false, data: error.message }
  }
}

export default sendEmail
