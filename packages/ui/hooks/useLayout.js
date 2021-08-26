import useMedia from './useMedia'

export default function useLayout ({
  layout,
  label,
  description
} = {}) {
  const { tablet } = useMedia()

  layout = layout || (label || description ? 'rows' : 'pure')
  if (layout !== 'pure' && !tablet) layout = 'rows'
  return layout
}
