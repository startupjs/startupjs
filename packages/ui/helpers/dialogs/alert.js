import { dialogOpen } from './helpers'

export default async function alert ({ title, message } = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const promise = await new Promise(resolve => {
    dialogOpen({
      title,
      children: message,
      cancelLabel: 'Ok',
      onDismiss: resolve
    })
  })

  return promise
}
