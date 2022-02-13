import React, { useContext, useMemo } from 'react'
import { DEBUG_CACHE_ACTIVE } from '@startupjs/cache'

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
  if (!DEBUG_CACHE_ACTIVE) return useMemo(() => ({ activate: () => {}, deactivate: () => {}, clear: () => {} }), [])
  const { cache } = useContext(ComponentMetaContext)
  return cache
}
