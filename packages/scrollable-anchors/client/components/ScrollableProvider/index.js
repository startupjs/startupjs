import React, { useEffect } from 'react'
import { observer, useOn, usePage, useLocal } from 'startupjs'
import PropTypes from 'prop-types'
import ScrollableArea from '../ScrollableArea'

const GLOBAL_ID = 'global'

function isUndefined (x) {
  return typeof x === 'undefined'
}

function ScrollableProvider ({ reactOnHash, children }) {
  const [hash] = useLocal('$render.hash')
  const [url] = useLocal('$render.url')

  const [anchorRegistry = {}, $anchorRegistry] = usePage('scrollableProvider.anchors')
  const [areaRegistry = {}, $areaRegistry] = usePage('scrollableProvider.areas')
  const [scrollQueue = [], $scrollQueue] = usePage('scrollableProvider.queue')

  useOn('ScrollableProvider.registerAnchor', onElementRegister)
  useOn('ScrollableProvider.unregisterAnchor', onElementUnregister)
  useOn('ScrollableProvider.registerArea', onAreaRegister)
  useOn('ScrollableProvider.unregisterArea', onAreaUnregister)
  useOn('ScrollableProvider.scrollTo', addScrollToQueue)

  function addScrollToQueue ({ anchorId, areaId = GLOBAL_ID, offset = 0 }) {
    if (!anchorId) throw new Error('Error [scrollable-anchors]: Provide id of anchor.')
    if (offset && !Number.isInteger(offset)) {
      console.warn('Warn [scrollable-anchors]: Offset must be an integer.')
      return
    }

    $scrollQueue.push({
      anchorId,
      areaId,
      offset
    })
  }

  function processQueue () {
    if (!scrollQueue || scrollQueue.length === 0) return

    const queueItemIndex = scrollQueue.findIndex(item => !isUndefined(anchorRegistry[item.anchorId]))

    const area = scrollQueue[queueItemIndex]
    if (!area) return

    const { areaId, anchorId, offset } = area

    const scrollRef = areaRegistry[areaId]
    const posY = anchorRegistry[anchorId]

    scrollRef.scrollTo({
      animated: true,
      y: posY + offset
    })

    $scrollQueue.remove(queueItemIndex)
  }

  function onElementRegister ({ anchorId, posY }) {
    if (!anchorId) throw new Error('Error [scrollable-anchors]: Provide anchorId of registering element.')
    if (isUndefined(posY)) throw new Error('Error [scrollable-anchors]: Provide posY of registering element.')
    if (!Number.isInteger(posY)) throw new Error('Error [scrollable-anchors]: posY must be an integer.')
    if (anchorId in anchorRegistry && posY === anchorRegistry[anchorRegistry]) {
      console.warn(`Warn [scrollable-anchors]: Anchor with anchorId ${anchorId} already registered`)
      return
    }

    $anchorRegistry.set(anchorId, posY)
  }

  function onElementUnregister (anchorId) {
    if (!anchorId) throw new Error('Error [scrollable-anchors]: Provide anchorId of unregistering element.')
    if (!anchorRegistry[anchorId]) {
      return
    }

    $anchorRegistry.del(anchorId)
  }

  function onAreaRegister ({ areaId, ref }) {
    if (!areaId) throw new Error('Error [scrollable-anchors]: Provide areaId of registering scrollable area.')
    if (!ref) throw new Error('Error [scrollable-anchors]: Provide ref of scrollable area.')
    if (areaId in areaRegistry) {
      console.warn(`Warn [scrollable-anchors]: Area with areaId ${areaId} already registered.`)
      return
    }

    $areaRegistry.set(areaId, ref)
  }

  function onAreaUnregister (areaId) {
    if (!areaId) throw new Error('Error [scrollable-anchors]: Provide areaId of unregistering scrollble area.')
    if (!areaRegistry[areaId]) {
      return
    }

    $areaRegistry.del(areaId)
  }

  function scrollToTop () {
    if (areaRegistry[GLOBAL_ID]) {
      areaRegistry[GLOBAL_ID].scrollTo({
        animated: true,
        y: 0
      })
    }
  }

  useEffect(() => {
    if (reactOnHash && hash) {
      addScrollToQueue({
        anchorId: hash.replace('#', '')
      })
    }
  }, [hash])

  // Scroll to top on url change
  useEffect(scrollToTop, [url])

  useEffect(processQueue, [JSON.stringify(scrollQueue), JSON.stringify(anchorRegistry)])
  return pug`
    ScrollableArea(id=GLOBAL_ID)
      =children
  `
}

ScrollableProvider.propTypes = {
  reactOnHash: PropTypes.bool.isRequired
}

ScrollableProvider.defaultProps = {
  reactOnHash: true
}

export default observer(ScrollableProvider)
