import React, { useContext, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { useComponentId, useValue, observer } from 'startupjs'

const PortalContext = React.createContext([])

const Provider = observer(({ children }) => {
  const [data, $data] = useValue({})

  // TODO: In many cases, when Dimensions change, the components change, but the previous old ones remain in the context.
  // Need to add possibility manually remove components from context, but right now when connecting to PortalContext we get an infinite re-render.
  function resetData () {
    $data.set({})
  }

  useEffect(() => {
    Dimensions.addEventListener('change', resetData)
    return () => {
      Dimensions.removeEventListener('change', resetData)
    }
  }, [])

  return pug`
    PortalContext.Provider(value=[data, $data])
      = children
      Listener
  `
})

const Manager = observer(({ state }) => {
  const [data] = state
  return Object.values(data).map(item => item)
})

// getter for children from context
function Listener () {
  return (
    <PortalContext.Consumer>
      {state => <Manager state={state} />}
    </PortalContext.Consumer>
  )
}

// setter for children to context
function Portal ({ children = {} }) {
  const componentId = useComponentId()
  const [, $data] = useContext(PortalContext)

  useEffect(() => {
    if (children) {
      $data.set(componentId, children)
    } else {
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
