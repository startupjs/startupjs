import { $ } from 'startupjs'
import { $toasts } from './helpers'

const MAX_SHOW_LENGTH = 3

// NOTE
// Is this the best way to update position of toasts?
// Is there a better way to do this?
// We want to remove unnecessary props from toast
// component that are added by these calculations.
const updateMatrixPositions = (() => {
  let timeout = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      const toasts = $toasts.get()
      const updatedToasts = toasts.map((toast, index) => {
        const prevToast = toasts[index - 1]
        toast.topPosition = prevToast ? prevToast.topPosition + prevToast.height : 0
        return toast
      })
      $toasts.set(updatedToasts)
    }, 50)
  }
})()

export default function toast({
  alert,
  icon,
  text,
  type,
  title,
  actionLabel,
  onAction,
  onClose
}) {
  const toastId = $.id()

  if ($toasts.get()?.length === MAX_SHOW_LENGTH) {
    $toasts[MAX_SHOW_LENGTH - 1].show.set(false)
  }

  function onRemove() {
    const index = getValidIndex()
    if (index !== -1) {
      $toasts[index].del()
      updateMatrixPositions()
      onClose?.()
    }
  }

  function getValidIndex() {
    return $toasts.get().findIndex(toast => toast.key === toastId)
  }

  function onLayout(layout) {
    const index = getValidIndex()
    if (index !== -1) {
      $toasts[index].height.set(layout.height)
      updateMatrixPositions()
    }
  }

  const newToast = {
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
  }

  const toasts = $toasts.get() || []
  toasts.unshift(newToast)
  $toasts.set(toasts)
}
