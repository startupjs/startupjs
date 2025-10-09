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
        = nodes[componentId]?.()
  `
})

// TODO: this probably rerenders each time and works incorrectly since children is new each time
function Portal ({ children }) {
  const componentId = useId()
  const { $order, nodes, $count } = useContext(PortalContext)

  useEffect(() => {
    nodes[componentId] = children
    if (!$order.get().includes(componentId)) $order.push(componentId)
    setTimeout(() => $count.increment(), 0)
  }, [children])

  useEffect(() => {
    return () => {
      delete nodes[componentId]
      const index = $order.get().indexOf(componentId)
      $order[index].del()
    }
  }, [])

  return null
}

const ObservedPortal = observer(Portal)

ObservedPortal.Provider = Provider

export default ObservedPortal
