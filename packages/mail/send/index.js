import { getProvider } from '../server/providers'
import getDataFromTemplate from './getDataFromTemplate'
import filterIgnoredEmails from './filterIgnoredEmails'
import getDataFromLayout from './getDataFromLayout'
import getSenderEmail from './getSenderEmail'
import getRecipientEmailsByIds from './getRecipientEmailsByIds'
import { DEFAULT_LAYOUT_NAME } from '../constants'

/**
 * @param {String} options.from - Any string compatible with your mail provider.
 * @param {String} options.senderId - id of email sender
 * @param {Boolean} options.ignoreWhitelist - should whitelist be ignored in DEV stage
 * @param {String|String[]} options.to - comma separated string with recipient emails 'mail1@mail.com, mail2@mail.com' or array of emails
 * @param {String[]} options.recipientIds - array of auths ids
 * @param {String} options.subject - mail subject
 * @param {String} options.text - mail text
 * @param {String} options.html - string with html
 * @param {Boolean} options.inline - inline image for html content (path to image)
 * @param {String} options.layout - name of layout would be used
 * REMOVE @param {Object} options.layoutOptions - object with options passed to layout
 * @param {String} options.template - name of template would be used
 * REMOVE @param {Object} options.templateOptions - object with options passed to template
 * @param {String} options.provider - name of provider would be used
 */

async function sendEmail (model, options) {
  try {
    const mailClient = getProvider(options.provider)
    const layoutName = options.layout || DEFAULT_LAYOUT_NAME

    const layoutData = await getDataFromLayout(
      model,
      layoutName
    )

    let recipientMails = await getRecipientEmailsByIds(model, options.recipientIds)

    let to = options.to || ''

    if (!Array.isArray(to)) {
      to = to.split(', ').filter(Boolean)
    }
    to = new Set([...to, ...recipientMails])

    if (!options.ignoreWhitelist) {
      to = [...await filterIgnoredEmails(model, to, layoutData.ignoreUnsubscribed)]
    }

    let _options = {
      providerOptions: options.providerOptions,
      from: await getSenderEmail(model, options),
      to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      inline: options.inline
    }

    if (options.template) {
      const { html, subject } = await getDataFromTemplate(
        model,
        options.template,
        options.templateOptions
      )
      _options.html = layoutData.html.replace('{{html}}', html)
      _options.subject = subject
    } else {
      _options.html = layoutData.html.replace('{{html}}', options.html)
    }

    const result = await mailClient.send(_options)

    console.log(`\n[@startupjs/mail] | Email${_options.to.length ? '' : 's'} to ${_options.to.join(', ')} has been sent to queue\nResult: ----->`, result)

    return result.success === false ? result : { success: true, result }
  } catch (error) {
    console.log('\n[@startupjs/mail] | Emailing failed\nResult: ---->', error.message, error)
    return { success: false, data: error.message }
  }
}

export default sendEmail
