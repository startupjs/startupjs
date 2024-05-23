import React, { useContext, useEffect } from 'react'
import { pug, useComponentId, $, observer } from 'startupjs'

const PortalContext = React.createContext()

const Provider = observer(({ children }) => {
  const $state = $({ order: [], nodes: {} })
  return pug`
    PortalContext.Provider(value=$state)
      = children
      Host($state=$state)
  `
})

const Host = observer(({ $state }) => {
  const { order, nodes } = $state.get()

  return pug`
    each componentId in order
      React.Fragment(key=componentId)
        = nodes[componentId]
  `
})

function Portal ({ children }) {
  const componentId = useComponentId()
  const $state = useContext(PortalContext)

  useEffect(() => {
    $state.nodes[componentId].set(children)
    const { $order } = $state
    if (!$order.get().includes(componentId)) $order.push(componentId)
  }, [children])

  useEffect(() => {
    return () => {
      $state.nodes[componentId].del()
      const { $order } = $state
      const index = $order.get().indexOf(componentId)
      $order[index].del()
    }
  }, [])

  return null
}

const ObservedPortal = observer(Portal)

ObservedPortal.Provider = Provider

export default ObservedPortal
