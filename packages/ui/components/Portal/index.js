import React, { useState, useContext, useEffect } from 'react'
import { useComponentId } from 'startupjs'

const PortalContext = React.createContext({})

function Provider ({ children }) {
  const [data, setData] = useState({})

  return pug`
    PortalContext.Provider(value=[data, setData])
      = children
      Listener
  `
}

// getter for children from context
function Listener () {
  const manager = state => {
    const [data] = state
    return Object.values(data).map(item => item)
  }

  return (
    <PortalContext.Consumer>
      {manager}
    </PortalContext.Consumer>
  )
}

// setter for children to context
function Portal ({ children = {} }) {
  const componentId = useComponentId()
  const [, setData] = useContext(PortalContext)

  useEffect(() => {
    setData(state => {
      return { ...state, [componentId]: children }
    })
  }, [children])

  return null
}

Portal.Provider = Provider
export default Portal
