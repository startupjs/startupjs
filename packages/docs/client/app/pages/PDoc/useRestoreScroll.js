// Hack to restore scroll position of the mdx doc's ScrollView
// when doing hot reloading.
import { useRef, useLayoutEffect, useCallback } from 'react'

const cache = {}

export default function useRestoreScroll (Component, ...inputs) {
  const view = useRef()
  let componentKey
  try {
    componentKey = hashCode((Component || '').toString())
  } catch (err) {
    componentKey = 'default'
  }

  const offsetY = getOffsetY(componentKey, JSON.stringify(inputs))

  useLayoutEffect(() => {
    view.current.scrollTo({ x: 0, y: offsetY, animated: false })
  }, [])

  const handleScroll = useCallback((event) => {
    const offsetY = (
      event &&
      event.nativeEvent &&
      event.nativeEvent.contentOffset &&
      event.nativeEvent.contentOffset.y
    )
    if (!cache[componentKey]) cache[componentKey] = {}
    cache[componentKey].prevOffsetY = offsetY
  }, [])

  return {
    ref: view,
    onScroll: handleScroll,
    scrollEventThrottle: 0
  }
}

function getOffsetY (componentKey, inputs) {
  if (!cache[componentKey]) cache[componentKey] = {}
  const state = cache[componentKey]
  if (inputs !== state.prevInputs) {
    state.prevOffsetY = 0
    state.prevInputs = inputs
  }
  return state.prevOffsetY
}

function hashCode (source) {
  let hash = 0
  if (source.length === 0) return hash
  for (var i = 0; i < source.length; i++) {
    const char = source.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
