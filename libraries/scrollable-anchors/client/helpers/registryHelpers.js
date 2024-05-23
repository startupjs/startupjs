import { emit } from 'startupjs'

export function scrollTo ({ anchorId, areaId, offset, smooth, y }) {
  emit('ScrollableProvider.scrollTo', { anchorId, areaId, offset, smooth, y })
}

export function registerAnchor ({ anchorId, posY }) {
  emit('ScrollableProvider.registerAnchor', { anchorId, posY })
}

export function unregisterAnchor (anchorId) {
  emit('ScrollableProvider.unregisterAnchor', anchorId)
}

export function registerArea ({ areaId, ref }) {
  emit('ScrollableProvider.registerArea', { areaId, ref })
}

export function unregisterArea (areaId) {
  emit('ScrollableProvider.unregisterArea', areaId)
}
