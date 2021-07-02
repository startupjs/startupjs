export default function useLayout ({ layout, label, description } = {}) {
  if (layout) return layout
  if (label || description) return 'rows'
  return 'pure'
}
