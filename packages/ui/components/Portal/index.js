import React, { useState, useContext, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { useComponentId } from 'startupjs'

const PortalContext = React.createContext([])

function Provider ({ children }) {
  const [data, setData] = useState({})

  // TODO: In many cases, when Dimensions change, the components change, but the previous old ones remain in the context.
  // Need to add possibility manually remove components from context, but right now when connecting to PortalContext we get an infinite re-render.
  function resetData () {
    setData({})
  }

  useEffect(() => {
    Dimensions.addEventListener('change', resetData)
    return () => {
      Dimensions.removeEventListener('change', resetData)
    }
  }, [])

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
      if (children) {
        state[componentId] = children
      } else {
        delete state[componentId]
      }
      return { ...state }
    })
  }, [children])

  useEffect(() => {
    return () => {
      setData(state => {
        delete state[componentId]
        return { ...state }
      })
    }
  }, [])

  return null
}

Portal.Provider = Provider
export default Portal
