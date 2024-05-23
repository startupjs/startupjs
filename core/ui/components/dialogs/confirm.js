import { openDialog } from './helpers'

export default async function confirm (options) {
  let title, message

  if (typeof options === 'string') {
    message = options
  } else {
    ({ title, message } = options || {})
  }

  if (title && typeof title !== 'string') {
    throw new Error('[@startupjs/ui] confirm: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] confirm: message should be a string')
  }

  const result = await new Promise(resolve => {
    openDialog({
      title,
      children: message,
      cancelLabel: 'Cancel',
      confirmLabel: 'OK',
      showCross: false,
      enableBackdropPress: false,
      onCancel: () => resolve(false),
      onConfirm: () => resolve(true)
    })
  })

  return result
}
