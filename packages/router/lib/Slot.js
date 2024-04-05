import { useEffect, memo, createElement as el } from 'react'
import { Outlet } from 'react-router'
import { useSlot } from './SlotsHost.js'

export default memo(function Slot ({ name, children }) {
  if (!name) return el(Outlet, null, children) // default react-router slot to nest child routes
  const slot = useSlot(name) // eslint-disable-line react-hooks/rules-of-hooks
  useEffect(() => { // eslint-disable-line react-hooks/rules-of-hooks
    return () => slot?.clearOverride()
  }, [])
  if (!slot) return null // if used outside of SlotsHost, just render nothing
  slot.renderOverride(children)
  return null
})
