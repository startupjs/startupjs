import conf from 'nconf'
import { templates } from '../initTemplates'
import { getProvider } from '../providers'

const STAGE = process.env.STAGE
const EMAIL_WHITELIST = [...(conf.get('ADMINS') || []), ...(conf.get('EMAIL_WHITELIST') || [])]
const isProduction = STAGE === 'production'

async function _getDataFromTemplate (template, options) {
  const data = await templates[template](options)
  return data
}

async function _checkPermission (email, model) {
  if (await _checkUnsubscribed(email, model)) return false
  if (!EMAIL_WHITELIST.includes(email)) {
    console.log(`\n[@startupjs/mail] We can't send email to address ("${email}") that not in whitelist in dev STAGE.\n`)
    return false
  }
  return true
}

async function _checkUnsubscribed (email, model) {
  const $auths = model.query('auths', {
    'emailSettings.unsubscribed': true,
    email,
    $count: true
  })
  await $auths.subscribe()
  const authsCount = $auths.getExtra()
  $auths.unsubscribe()
  return !!authsCount
}

async function _filterIgnoredEmails (emails, model) {
  let filteredEmails = []
  for (let email of emails) {
    if (await _checkPermission(email, model)) {
      filteredEmails.push(email)
    }
  }
  return filteredEmails
}

/**
 * @param
 * @param {Boolean} options.ignoreWhitelist - should whitelist be ignored in DEV stage
 * @param {String|String[]} options.to - comma separated string with recipient emails 'mail1@mail.com, mail2@mail.com' or array of emails
 * @param {String} options.subject - mail subject
 * @param {String} options.text - mail text
 * @param {String} options.html - string with html
 * @param {Boolean} options.inline - inline image for html content (path to image)
 * @param {String} options.template - name of template would be used
 * @param {Object} options.templateOptions - object with options passed to template
 * @param {String} options.provider - name of provider would be used
 */

// TODO: (model, options)
async function sendEmail (model, options) {
  const mailClient = getProvider(options.provider)

  try {
    const from = options.from || process.env.MAILGUN_FROM_ID || conf.get('MAILGUN_FROM_ID')

    let to = options.to
    if (!Array.isArray(to)) {
      to = to.split(', ')
    }

    if (!isProduction && !options.ignoreWhitelist) {
      to = [...await _filterIgnoredEmails(to, model)]
    }

    let _options = {
      from,
      to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      inline: options.inline
    }

    if (options.template) {
      const { html, subject } = await _getDataFromTemplate(
        options.template,
        options.templateOptions
      )
      _options.html = html
      _options.subject = subject
    }

    const result = await mailClient.send(_options)

    console.log(`\n[@startupjs/mail] | Email${_options.to.length ? '' : 's'} to ${_options.to.join(', ')} has been sent to queue\nResult: ----->`, result)

    return result.success === false ? result : { success: true, result }
  } catch (error) {
    console.log('\n[@startupjs/mail] | Emailing to failed\nResult: ---->', error.message, error)
    return { success: false, data: error.message }
  }
}

export default sendEmail
