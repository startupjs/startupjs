import axios from 'axios'

/**
 * @param {String} options.from - Any string compatible with your mail provider.
 *
 * @param {String} options.senderId - id of email sender
 * @param {Boolean} options.ignoreWhitelist - should whitelist be ignored in DEV stage
 * @param {String|String[]} options.to - comma separated string with recipient emails 'mail1@mail.com, mail2@mail.com' or array of emails
 * @param {String[]} options.recipientIds - array of auths ids
 * @param {String} options.subject - mail subject
 * @param {String} options.text - mail text
 * @param {String} options.html - string with html
 * @param {Boolean} options.inline - inline image for html content (path to image)
 * @param {String} options.layout - name of layout would be used
 * @param {Object} options.layoutOptions - object with options passed to layout
 * @param {String} options.template - name of template would be used
 * @param {Object} options.templateOptions - object with options passed to template
 * @param {String} options.provider - name of provider would be used
 */

export default async function sendEmail (options = {}) {
  const res = await axios.post('/api/mail/send', options)
  return res
}
