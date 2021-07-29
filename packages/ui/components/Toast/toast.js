import { $root } from 'startupjs'

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
  const $toasts = $root.scope('_session.toasts')
  $toasts.set($root.id(), {
    alert,
    icon,
    type,
    text,
    title,
    actionLabel,
    closeLabel,
    onAction,
    onClose
  })
}
