import useMedia from './useMedia'

export default function useLayout ({
  layout,
  preferredLayout,
  label,
  description
} = {}) {
  const { tablet } = useMedia()

  layout = layout || (label || description ? preferredLayout || 'rows' : 'pure')
  if (layout !== 'pure' && !tablet) layout = 'rows'
  return layout
}
