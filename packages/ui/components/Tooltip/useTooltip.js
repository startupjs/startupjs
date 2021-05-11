export default function useTooltip ({
  showTooltipInvolved,
  onPress,
  onLongPress,
  onChange
}) {
  if (showTooltipInvolved) return {}

  function _onLongPress (cb) {
    onChange(true)
    onLongPress && onLongPress()
  }

  return {
    onLongPress: () => _onLongPress(),
    onPressOut: () => onChange(false),
    onPress: onPress || onLongPress
  }
}
