import { openDialog } from './helpers'

export default async function alert ({ title, message } = {}) {
  if (title && typeof title !== 'string') {
    throw new Error('[@startupjs/ui] alert: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs/ui] alert: message should be a string')
  }

  const promise = await new Promise(resolve => {
    openDialog({
      title,
      children: message,
      cancelLabel: 'OK',
      onCancel: resolve,
      showCross: false,
      enableBackdropPress: false
    })
  })

  return promise
}
