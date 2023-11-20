import React, { useEffect, useRef, useCallback } from 'react'
import { pug, observer, useOn, usePage, useLocal, emit } from 'startupjs'
import { ScrollView } from '@startupjs/ui'
import _debounce from 'lodash/debounce'
import PropTypes from 'prop-types'

const GLOBAL_ID = 'global'

function isUndefined (x) {
  return typeof x === 'undefined'
}

function ScrollableProvider ({ reactOnHash, style, children, ...rest }) {
  const [hash] = useLocal('$render.hash')
  const [url] = useLocal('$render.url')

  const globalScrollRef = useRef()

  const [anchorRegistry = {}, $anchorRegistry] = usePage('scrollableProvider.anchors')
  const [, $areaRegistry] = usePage('scrollableProvider.areas')
  const [scrollQueue = [], $scrollQueue] = usePage('scrollableProvider.queue')

  useOn('ScrollableProvider.registerAnchor', onElementRegister)
  useOn('ScrollableProvider.unregisterAnchor', onElementUnregister)
  useOn('ScrollableProvider.registerArea', onAreaRegister)
  useOn('ScrollableProvider.unregisterArea', onAreaUnregister)
  useOn('ScrollableProvider.scrollTo', addScrollToQueue)

  function addScrollToQueue ({ anchorId, areaId = GLOBAL_ID, offset = 0, y, smooth = true }) {
    if (!anchorId && isUndefined(y)) {
      throw new Error('Error [scrollable-anchors]: Provide id of anchor or y position.')
    }

    // To prevent rasecondition issue of cleaning previous registered values
    setTimeout(() => {
      $scrollQueue.push({
        anchorId,
        areaId,
        offset,
        y,
        smooth
      })
    }, 0)
  }

  function processQueue () {
    if (!scrollQueue || scrollQueue.length === 0) return

    // Find first element from query that have anvhorId or have y position offset
    // (in case scroll to specifik postition, ot to anchor)
    const queueItemIndex = scrollQueue.findIndex(item => !isUndefined($anchorRegistry.get(item.anchorId)) || !isUndefined(item.y))

    const item = $scrollQueue.get(queueItemIndex)
    if (!item) return

    const { areaId, anchorId, offset, y, smooth } = item

    const scrollRef = areaId === GLOBAL_ID ? globalScrollRef.current : $areaRegistry.get(areaId)

    // Seems ref is expired :(
    if (!scrollRef) return

    const posY = isUndefined(y) ? $anchorRegistry.get(anchorId) : y

    scrollRef.scrollTo({
      animated: smooth,
      y: posY + offset
    })

    $scrollQueue.remove(queueItemIndex)
  }

  function onElementRegister ({ anchorId, posY }) {
    if (!anchorId) throw new Error('Error [scrollable-anchors]: Provide anchorId of registering element.')
    if (isUndefined(posY)) throw new Error('Error [scrollable-anchors]: Provide posY of registering element.')

    // To prevent raсecondition issue of cleaning previous registered values
    setTimeout(() => {
      $anchorRegistry.set(anchorId, posY)
    }, 0)
  }

  function onElementUnregister (anchorId) {
    if (!anchorId) throw new Error('Error [scrollable-anchors]: Provide anchorId of unregistering element.')

    $anchorRegistry.del(anchorId)
  }

  function onAreaRegister ({ areaId, ref }) {
    if (!areaId) throw new Error('Error [scrollable-anchors]: Provide areaId of registering scrollable area.')
    if (!ref) throw new Error('Error [scrollable-anchors]: Provide ref of scrollable area.')

    // To prevent rasecondition issue of cleaning previous registered values
    setTimeout(() => {
      $areaRegistry.set(areaId, ref)
    }, 0)
  }

  function onAreaUnregister (areaId) {
    if (!areaId) throw new Error('Error [scrollable-anchors]: Provide areaId of unregistering scrollble area.')

    $areaRegistry.del(areaId)
  }

  function scrollToTop () {
    addScrollToQueue({
      smooth: false,
      areaId: GLOBAL_ID,
      y: 0
    })
  }

  // Recalc anchors positions on content height change
  const onDimensionChange = useCallback(
    _debounce(() => {
      emit('ScrollableProvider.recalcPositions')
    }, 500),
    []
  )

  useEffect(() => {
    if (reactOnHash && hash) {
      addScrollToQueue({
        anchorId: decodeURI(hash.replace('#', ''))
      })
    }
  }, [hash])
  // Scroll to top on url change
  useEffect(scrollToTop, [url])
  useEffect(processQueue, [JSON.stringify(scrollQueue), JSON.stringify(anchorRegistry)])
  return pug`
    ScrollView(
      ref=globalScrollRef
      style=style
      onContentSizeChange=onDimensionChange
      ...rest
    )
      = children
  `
}

ScrollableProvider.propTypes = {
  reactOnHash: PropTypes.bool.isRequired
}

ScrollableProvider.defaultProps = {
  reactOnHash: true
}

export default observer(ScrollableProvider)
