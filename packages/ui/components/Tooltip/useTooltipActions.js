export default function useTooltipActions ({ onChange }) {
  return {
    onOpen: () => onChange(true),
    onClose: () => onChange(false)
  }
}
