import React, { useContext } from 'react'

export const ComponentMetaContext = React.createContext({})

export function useNow () {
  let { createdAt } = useContext(ComponentMetaContext)
  return createdAt
}

export function useComponentId () {
  let { componentId } = useContext(ComponentMetaContext)
  return componentId
}
