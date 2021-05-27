export default function useTooltipProps ({
  onPress,
  onLongPress,
  onChange
}) {
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
