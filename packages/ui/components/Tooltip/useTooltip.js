export default function useTooltip ({
  onPress,
  onLongPress,
  onChange
}) {
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
