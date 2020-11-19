import { Dimensions } from 'react-native'
import {
  PLACEMENTS_ORDER,
  ARROW_SIZE,
  POSITIONS_REVERSE,
  POPOVER_MARGIN
} from './constants.json'

function Geometry ({
  placement,
  placements,
  contentInfo,
  captionSize,
  hasArrow
}) {
  this.initPlacement = placement
  this.leftPositions = {}
  this.topPositions = {}
  this.arrowLeftPositions = {}
  this.arrowTopPositions = {}

  calcLeftPositions.call(this, { contentInfo, captionSize, hasArrow })
  calcTopPositions.call(this, { contentInfo, captionSize, hasArrow })

  calcLeftPositionsArrow.call(this, { contentInfo })
  calcTopPositionsArrow.call(this, { contentInfo })

  prepareTopPositions.call(this, { contentInfo })
  prepareLeftPositions.call(this, { contentInfo })
  preparePlacements.call(this, { placement, placements })

  this.getValidPlacement = getValidPlacement
  this.validPlacement = this.getValidPlacement({ placement, contentInfo })
  this.positionLeft = this.leftPositions[this.validPlacement]
  this.positionTop = this.topPositions[this.validPlacement]
  this.arrowLeftPosition = this.arrowLeftPositions[this.validPlacement]
  this.arrowTopPosition = this.arrowTopPositions[this.validPlacement]
}

function calcLeftPositions ({ contentInfo, captionSize, hasArrow }) {
  let positionRootLeft = contentInfo.x
  positionRootLeft = positionRootLeft - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.leftPositions['left-start'] = positionRootLeft
  this.leftPositions['left-center'] = positionRootLeft
  this.leftPositions['left-end'] = positionRootLeft

  let positionRootRight = contentInfo.x + captionSize.width
  positionRootRight = positionRootRight + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.leftPositions['right-start'] = positionRootRight
  this.leftPositions['right-center'] = positionRootRight
  this.leftPositions['right-end'] = positionRootRight

  const positionMinorLeft = contentInfo.x
  this.leftPositions['bottom-start'] = positionMinorLeft
  this.leftPositions['top-start'] = positionMinorLeft

  const positionMinorCenter = contentInfo.x - (contentInfo.width / 2) + (captionSize.width / 2)
  this.leftPositions['top-center'] = positionMinorCenter
  this.leftPositions['bottom-center'] = positionMinorCenter

  const positionMinorRight = contentInfo.x - contentInfo.width + captionSize.width
  this.leftPositions['bottom-end'] = positionMinorRight
  this.leftPositions['top-end'] = positionMinorRight
}

function calcTopPositions ({ captionSize, contentInfo, hasArrow }) {
  let positionRootBottom = contentInfo.y + captionSize.height
  positionRootBottom = positionRootBottom + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.topPositions['bottom-start'] = positionRootBottom
  this.topPositions['bottom-center'] = positionRootBottom
  this.topPositions['bottom-end'] = positionRootBottom

  let positionRootTop = contentInfo.y
  positionRootTop = positionRootTop - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.topPositions['top-start'] = positionRootTop
  this.topPositions['top-center'] = positionRootTop
  this.topPositions['top-end'] = positionRootTop

  const positionMinorCenter = contentInfo.y + (captionSize.height / 2) - (contentInfo.height / 2)
  this.topPositions['left-center'] = positionMinorCenter
  this.topPositions['right-center'] = positionMinorCenter

  this.topPositions['left-start'] = contentInfo.y
  this.topPositions['right-start'] = contentInfo.y

  this.topPositions['left-end'] = contentInfo.y + captionSize.height
  this.topPositions['right-end'] = contentInfo.y + captionSize.height
}

function calcLeftPositionsArrow ({ contentInfo }) {
  this.arrowLeftPositions['top-start'] = 10
  this.arrowLeftPositions['bottom-start'] = 10

  let positionMinorRight = contentInfo.width - (ARROW_SIZE * 2) - 10
  this.arrowLeftPositions['top-end'] = positionMinorRight
  this.arrowLeftPositions['bottom-end'] = positionMinorRight

  let positionMinorCenter = (contentInfo.width / 2) - ARROW_SIZE
  this.arrowLeftPositions['top-center'] = positionMinorCenter
  this.arrowLeftPositions['bottom-center'] = positionMinorCenter

  this.arrowLeftPositions['left-center'] = '100%'
  this.arrowLeftPositions['left-start'] = '100%'
  this.arrowLeftPositions['left-end'] = '100%'

  this.arrowLeftPositions['right-start'] = -(ARROW_SIZE * 2)
  this.arrowLeftPositions['right-center'] = -(ARROW_SIZE * 2)
  this.arrowLeftPositions['right-end'] = -(ARROW_SIZE * 2)
}

function calcTopPositionsArrow ({ contentInfo }) {
  this.arrowTopPositions['top-start'] = '100%'
  this.arrowTopPositions['top-center'] = '100%'
  this.arrowTopPositions['top-end'] = '100%'

  const positionRootCenter = (contentInfo.height / 2) - ARROW_SIZE
  this.arrowTopPositions['left-center'] = Math.floor(positionRootCenter)
  this.arrowTopPositions['right-center'] = Math.floor(positionRootCenter)

  this.arrowTopPositions['bottom-start'] = -(ARROW_SIZE * 2)
  this.arrowTopPositions['bottom-center'] = -(ARROW_SIZE * 2)
  this.arrowTopPositions['bottom-end'] = -(ARROW_SIZE * 2)

  this.arrowTopPositions['left-start'] = 10
  this.arrowTopPositions['right-start'] = 10

  this.arrowTopPositions['left-end'] = contentInfo.height - (ARROW_SIZE * 2) - 10
  this.arrowTopPositions['right-end'] = contentInfo.height - (ARROW_SIZE * 2) - 10
}

function prepareTopPositions ({ contentInfo }) {
  this.prepareTopPositions = { ...this.topPositions }
  this.prepareTopPositions['top-start'] -= contentInfo.height
  this.prepareTopPositions['top-center'] -= contentInfo.height
  this.prepareTopPositions['top-end'] -= contentInfo.height
  this.prepareTopPositions['right-end'] -= contentInfo.height
  this.prepareTopPositions['left-end'] -= contentInfo.height
}

function prepareLeftPositions ({ contentInfo }) {
  this.prepareLeftPositions = { ...this.leftPositions }
  this.prepareLeftPositions['left-start'] -= contentInfo.width
  this.prepareLeftPositions['left-center'] -= contentInfo.width
  this.prepareLeftPositions['left-end'] -= contentInfo.width
}

function preparePlacements ({ placement, placements }) {
  if (placements.length !== PLACEMENTS_ORDER.length) {
    this.preparePlacements = PLACEMENTS_ORDER.filter(item => {
      return placements.indexOf(item) !== -1
    })
    return
  }

  this.preparePlacements = PLACEMENTS_ORDER
  const activeIndexPlacement = this.preparePlacements.findIndex(item => {
    return item === this.initPlacement
  })

  const [position, attachment] = this.preparePlacements[activeIndexPlacement].split('-')
  const reversePlacement = `${POSITIONS_REVERSE[position]}-${attachment}`
  const reverseIndexPlacement = this.preparePlacements.findIndex(item => {
    return item === reversePlacement
  })
  this.preparePlacements = this.preparePlacements.filter(item => {
    return item !== reversePlacement
  })

  this.preparePlacements = [
    ...this.preparePlacements.slice(0, activeIndexPlacement),
    PLACEMENTS_ORDER[reverseIndexPlacement],
    ...this.preparePlacements.slice(activeIndexPlacement)
  ]
}

function getValidPlacement ({ placement, contentInfo }) {
  if (!this.counter) this.counter = 1
  else this.counter++

  if (this.counter > this.preparePlacements.length) {
    return this.initPlacement
  }

  const activeIndexPlacement = this.preparePlacements.findIndex(item => {
    return item === placement
  })

  let nextIndex = activeIndexPlacement + 1
  if (nextIndex > this.preparePlacements.length - 1) nextIndex = 0

  const _leftPosition = this.prepareLeftPositions[placement]
  if (_leftPosition < 0 ||
      _leftPosition + contentInfo.width > Dimensions.get('window').width) {
    return this.getValidPlacement({
      placement: this.preparePlacements[nextIndex],
      contentInfo
    })
  }

  const _topPosition = this.prepareTopPositions[placement]
  if (_topPosition < 0 ||
    _topPosition + contentInfo.height > Dimensions.get('window').height) {
    return this.getValidPlacement({
      placement: this.preparePlacements[nextIndex],
      contentInfo
    })
  }

  return this.preparePlacements[activeIndexPlacement]
}

export default Geometry
