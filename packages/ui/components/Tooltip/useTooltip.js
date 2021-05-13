export default function useTooltip ({
  showTooltipInvolved,
  onPress,
  onLongPress,
  onChange
}) {
  if (showTooltipInvolved) return {}

  function _onLongPress (e) {
    onChange(true)
    onLongPress && onLongPress(e)
  }

  return {
    onLongPress: e => _onLongPress(e),
    onPressOut: () => onChange(false),
    onPress: onPress || onLongPress
  }
}
