export default function useTooltipCommon ({ onChange }) {
  return {
    onOpen: () => onChange(true),
    onClose: () => onChange(false)
  }
}
