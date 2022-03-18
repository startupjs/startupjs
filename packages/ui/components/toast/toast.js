import { $root } from 'startupjs'
import { getToastsModel } from './helpers'

const MAX_SHOW_LENGTH = 3

// NOTE
// Is this the best way to update position of toasts?
// Is there a better way to do this?
// We want to remove unnecessary props from toast
// component that are added by these calculations.
const updateMatrixPositions = () => {
  const $toasts = getToastsModel()
  const toasts = $toasts.get()

  const updateToasts = toasts.map((toast, index) => {
    const prevToast = toasts[index - 1]

    if (prevToast) {
      toast.topPosition = prevToast.topPosition + prevToast.height
    } else {
      toast.topPosition = 0
    }

    return toast
  })

  $toasts.set(updateToasts)
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
  const $toasts = getToastsModel()

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

  // NOTE
  // Think about using context instead of model
  // We can provide registerToast function in context
  // Which will be better? model or context?
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
