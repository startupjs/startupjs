import { memo, useState, useCallback, useEffect } from 'react'
import { useSlot } from './SlotsHost.js'

export default memo(function SlotProvider ({ name, children }) {
  if (!name) throw Error('SlotProvider: name is required')
  const forceUpdate = useForceUpdate()
  const slot = useSlot(name)
  useEffect(() => {
    return () => slot?.clearRerender()
  }, [])
  if (!slot) return children // if used outside of SlotsHost, just render children
  slot.setRerender(forceUpdate)
  return slot.render(children)
})

function useForceUpdate () {
  const [, setState] = useState(Math.random())
  return useCallback(() => setState(Math.random()), [])
}
