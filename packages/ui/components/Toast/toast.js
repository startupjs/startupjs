import { $root } from 'startupjs'

export default function toast ({
  alert,
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
    alert,
    icon,
    label,
    title,
    renderActions,
    content,
    onClose
  })
}
