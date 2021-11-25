import { $root } from 'startupjs'

const MAX_SHOW_LENGTH = 3

const updateMatrixPositions = () => {
  const toasts = $root.scope('_session.ui.toasts').get()

  const updateToasts = toasts.map((toast, index) => {
    const prevToast = toasts[index - 1]

    if (prevToast) {
      toast.topPosition = prevToast.topPosition + prevToast.height
    } else {
      toast.topPosition = 0
    }

    return toast
  })

  $root.scope('_session.ui.toasts').set(updateToasts)
}

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
  const $toasts = $root.scope('_session.ui.toasts')

  if ($toasts.get()?.length === MAX_SHOW_LENGTH) {
    $toasts.set(`${MAX_SHOW_LENGTH - 1}.show`, false)
  }

  if (!alert) {
    setTimeout(() => {
      const index = getValidIndex()
      if (index !== -1) $toasts.set(`${index}.show`, false)
    }, 5000)
  }

  function onRemove () {
    const index = getValidIndex()
    if (index === -1) return

    $toasts.remove(index)
    updateMatrixPositions()
    onClose && onClose()
  }

  // toastId ensures that the correct index is found at the current moment
  function getValidIndex () {
    return $toasts.get().findIndex(toast => toast.key === toastId)
  }

  function onLayout (layout) {
    $toasts.set(`${getValidIndex()}.height`, layout.height)
    updateMatrixPositions()
  }

  $toasts.unshift({
    key: toastId,
    show: true,
    topPosition: 0,
    alert,
    icon,
    type,
    text,
    title,
    actionLabel,
    onAction,
    onClose: onRemove,
    onLayout
  })
}
