import React, { useContext, useEffect } from 'react'
import { useComponentId, useValue, observer } from 'startupjs'

const PortalContext = React.createContext()

const Provider = observer(({ children }) => {
  const [, $state] = useValue({ order: [], nodes: {} })
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
    $state.set(`nodes.${componentId}`, children)
    const $order = $state.at('order')
    const order = $order.get()
    if (!order.includes(componentId)) $order.push(componentId)
  }, [children])

  useEffect(() => {
    return () => {
      $state.del(`nodes.${componentId}`)
      const $order = $state.at('order')
      const order = $order.get()
      const index = order.indexOf(componentId)
      $order.remove(index)
    }
  }, [])

  return null
}

const ObservedPortal = observer(Portal)

ObservedPortal.Provider = Provider

export default ObservedPortal
