// Hack to restore scroll position of the mdx doc's ScrollView
// when doing hot reloading.
import { useRef, useLayoutEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import { $root } from 'startupjs'

const isWeb = Platform.OS === 'web'
const cache = {}

export default function useRestoreScroll (Component, ...inputs) {
  const view = useRef()
  let componentKey
  try {
    componentKey = hashCode((Component || '').toString())
  } catch (err) {
    componentKey = 'default'
  }

  useLayoutEffect(() => {
    const offsetY = getCacheOffsetY(componentKey, JSON.stringify(inputs)) ||
      getHashOffsetY()
    if (offsetY == null) return
    view.current.scrollTo({ x: 0, y: offsetY, animated: false })
  }, inputs)

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

function getCacheOffsetY (componentKey, inputs) {
  const state = cache[componentKey]
  // don't jump to top of the page on initial render if you are scrolled
  // or if you don't scroll page yet
  if (!state) return
  if (inputs !== state.prevInputs) {
    state.prevOffsetY = 0
    state.prevInputs = inputs
  }

  return state.prevOffsetY
}

function getHashOffsetY () {
  if (!isWeb) return
  const hash = decodeURI($root.get('$render.hash').replace(/^#/, ''))
  return $root.get(`_session.anchors.${hash}`)
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
