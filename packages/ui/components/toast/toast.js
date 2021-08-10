import { $root } from 'startupjs'

const MAX_SHOW_LENGTH = 3

export default function toast ({
  alert,
  icon,
  text,
  type,
  title,
  actionLabel,
  onAction,
  onClose
}) {
  const toastId = $root.id()
  const $toasts = $root.scope('_session.toasts')

  if ($toasts.get()?.length === MAX_SHOW_LENGTH) {
    $toasts.set(`${MAX_SHOW_LENGTH - 1}.show`, false)
  }

  if (!alert) {
    setTimeout(() => {
      const index = $toasts.get().findIndex(toast => toast.key === toastId)
      $toasts.set(`${index}.show`, false)
    }, 5000)
  }

  function _onClose () {
    // toastId ensures that the correct index is found at the current moment
    const index = $toasts.get().findIndex(toast => toast.key === toastId)
    $toasts.remove(index)
    onClose && onClose()
  }

  $toasts.unshift({
    show: true,
    key: toastId,
    alert,
    icon,
    type,
    text,
    title,
    actionLabel,
    onAction,
    onClose: _onClose
  })
}
