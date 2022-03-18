import React, { useContext, useMemo } from 'react'
import { CACHE_ACTIVE, getDummyCache } from '@startupjs/cache'

export const ComponentMetaContext = React.createContext({})

export function useNow () {
  const { createdAt } = useContext(ComponentMetaContext)
  return createdAt
}

export function useComponentId () {
  const { componentId } = useContext(ComponentMetaContext)
  return componentId
}

export function useCache (active) {
  if (!CACHE_ACTIVE.value || !active) return useMemo(getDummyCache, [])
  const { cache } = useContext(ComponentMetaContext)
  return cache
}
