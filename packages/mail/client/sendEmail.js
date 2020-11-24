import axios from 'axios'

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

//  domain, host ????

//  to -> recipientIds (recipientMails ???)

export default async function sendEmail (options = {}) {
  const res = await axios.post('/api/send-email', options)
  return res
}
