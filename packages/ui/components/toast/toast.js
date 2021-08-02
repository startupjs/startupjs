import { $root } from 'startupjs'

const MAX_SHOW_LENGTH = 3

export default function toast ({
  alert,
  icon,
  text,
  type,
  title,
  actionLabel,
  closeLabel,
  onAction,
  onClose
}) {
  const toastId = $root.id()
  const $toasts = $root.scope('_session.toasts')

  const toasts = $toasts.get()
  if (toasts?.length === MAX_SHOW_LENGTH) {
    $toasts.set('2.show', false)
  }

  function _onClose () {
    $toasts.remove(toasts.length - 1)
    onClose && onClose()
  }

  function _onAction () {
    onAction && onAction()
    onClose && onClose()
  }

  $toasts.unshift({
    show: true,
    toastId,
    alert,
    icon,
    type,
    text,
    title,
    actionLabel,
    closeLabel,
    onAction: _onAction,
    onClose: _onClose
  })
}
