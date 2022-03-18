import { openDialog } from './helpers'

export default async function confirm ({
  title,
  message
} = {}) {
  if (title && typeof title !== 'string') {
    throw new Error('[@startupjs/ui] alert: title should be a string')
  }

  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
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
