import { useMemo, useContext, createContext } from 'react'
import { CACHE_ACTIVE, getDummyCache } from '@startupjs/cache'
import useIsomorphicLayoutEffect from '@startupjs/utils/useIsomorphicLayoutEffect'

export const ComponentMetaContext = createContext({})

export function pipeComponentDisplayName (SourceComponent, TargetComponent, suffix = '', defaultName = 'StartupjsWrapper') {
  const displayName = SourceComponent.displayName || SourceComponent.name

  if (!TargetComponent.displayName) {
    TargetComponent.displayName = displayName ? (displayName + suffix) : defaultName
  }
}

export function pipeComponentMeta (SourceComponent, TargetComponent, suffix = '', defaultName = 'StartupjsWrapper') {
  pipeComponentDisplayName(SourceComponent, TargetComponent, suffix, defaultName)

  if (!TargetComponent.propTypes && SourceComponent.propTypes) {
    TargetComponent.propTypes = SourceComponent.propTypes
  }
  if (!TargetComponent.defaultProps && SourceComponent.defaultProps) {
    TargetComponent.defaultProps = SourceComponent.defaultProps
  }
  return TargetComponent
}

export function useCache (active) {
  if (!CACHE_ACTIVE.value || !active) return useMemo(getDummyCache, []) // eslint-disable-line react-hooks/rules-of-hooks
  const { cache } = useContext(ComponentMetaContext) // eslint-disable-line react-hooks/rules-of-hooks
  return cache
}

export function useUnmount (fn) {
  useIsomorphicLayoutEffect(() => fn, [])
}
