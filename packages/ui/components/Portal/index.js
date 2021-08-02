import React, { useContext, useEffect } from 'react'
import { useComponentId, useValue, observer } from 'startupjs'

const PortalContext = React.createContext([])

const Provider = ({ children }) => {
  const [data, $data] = useValue({})

  return pug`
    PortalContext.Provider(value=[data, $data])
      = children
      Listener
  `
}

function Listener () {
  return pug`
    PortalContext.Consumer
      = renderChildren
  `
}

function renderChildren (state) {
  return pug`
    Manager(state=state)
  `
}

const Manager = observer(({ state }) => {
  const [data] = state
  return Object.values(data).map(item => item)
})

function Portal ({ children = {} }) {
  const componentId = useComponentId()
  const [data, $data] = useContext(PortalContext)

  useEffect(() => {
    if (children) {
      $data.set(componentId, React.cloneElement(children, {
        ...children.props,
        key: componentId
      }))
    } else if (data[componentId]) {
      $data.del(componentId)
    }
  }, [children])

  useEffect(() => {
    return () => {
      $data.del(componentId)
    }
  }, [])

  return null
}

Portal.Provider = Provider

export default Portal
