import { $root } from 'startupjs'

export default function toast ({
  variant,
  icon,
  label,
  title,
  renderActions,
  content,
  onClose
}) {
  const toastId = $root.id()
  const $toasts = $root.scope('_page.toasts')

  $toasts.set(toastId, {
    variant,
    icon,
    label,
    title,
    renderActions,
    content,
    onClose
  })

  // TODO: animation
  setTimeout(() => {
    $toasts.del(toastId)
  }, 3000)
}
