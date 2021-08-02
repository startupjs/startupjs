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

  if ($toasts.get()?.length === MAX_SHOW_LENGTH) {
    $toasts.set('2.show', false)
  }

  function _onClose () {
    // toastId ensures that the correct index is found at the current moment
    const index = $toasts.get().findIndex(toast => toast.id === toastId)
    $toasts.remove(index)
    onClose && onClose()
  }

  $toasts.unshift({
    show: true,
    id: toastId,
    alert,
    icon,
    type,
    text,
    title,
    actionLabel,
    closeLabel,
    onAction,
    onClose: _onClose
  })
}
