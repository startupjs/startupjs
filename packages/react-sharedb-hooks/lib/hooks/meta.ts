import React, { useContext } from 'react'

export const ComponentMetaContext: any = React.createContext({})

export function useNow (): number {
  const { createdAt } = useContext(ComponentMetaContext)
  return createdAt
}

export function useComponentId (): string {
  const { componentId } = useContext(ComponentMetaContext)
  return componentId
}
