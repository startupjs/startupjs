import React, { useContext, useEffect, useId, useRef } from 'react'
import { pug, $, observer } from 'startupjs'

const PortalContext = React.createContext()

const Provider = observer(({ children }) => {
  const $order = $([])
  const $count = $(0)
  const contextRef = useRef({ $order, nodes: {}, $count })
  return pug`
    PortalContext.Provider(value=contextRef.current)
      = children
      Host(...contextRef.current)
  `
})

const Host = observer(({ $order, nodes, $count }) => {
  $count.get()
  return pug`
    each componentId in $order.get()
      React.Fragment(key=componentId)
        = nodes[componentId]
  `
})

function Portal ({ children }) {
  const uuid = useId()
  const { $order, nodes, $count } = useContext(PortalContext)
  const componentIdRef = useRef(uuid)

  useEffect(() => {
    const componentId = componentIdRef.current
    nodes[componentId] = children
    if (!$order.get().includes(componentId)) $order.push(componentId)
    setTimeout(() => $count.increment(), 0)
  }, [$count, $order, children, nodes])

  useEffect(() => {
    const componentId = componentIdRef.current
    return () => {
      delete nodes[componentId]
      const index = $order.get().indexOf(componentId)
      if (index !== -1 && $order.get()[index]) $order[index].del()
    }
  }, [$order, nodes])

  return null
}

const ObservedPortal = observer(Portal)

ObservedPortal.Provider = Provider

export default ObservedPortal
