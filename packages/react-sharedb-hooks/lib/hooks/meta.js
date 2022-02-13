import React, { useContext } from 'react'

export const ComponentMetaContext = React.createContext({})

export function useNow () {
  const { createdAt } = useContext(ComponentMetaContext)
  return createdAt
}

export function useComponentId () {
  const { componentId } = useContext(ComponentMetaContext)
  return componentId
}

export function useCache () {
  const { cache } = useContext(ComponentMetaContext)
  return cache
}
