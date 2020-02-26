export default function useLayout (layout, label) {
  if (layout) return layout
  if (label) return 'rows'
  return 'pure'
}
