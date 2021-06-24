import { dialogOpen } from './helpers'

export default async function confirm ({
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm'
} = {}) {
  if (typeof message !== 'string') {
    throw new Error('[@startupjs/app] alert: message should be a string')
  }

  const result = await new Promise(resolve => {
    dialogOpen({
      title,
      children: message,
      cancelLabel,
      confirmLabel,
      onCancel: () => resolve(false),
      onConfirm: () => resolve(true),
      onDismiss: () => resolve()
    })
  })

  return result
}
