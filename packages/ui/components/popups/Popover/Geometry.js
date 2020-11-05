import { Dimensions } from 'react-native'
import { PLACEMENT_ORDER, ARROW_SIZE, POPOVER_MARGIN } from './constants.json'

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

  this.preparePlacements = PLACEMENT_ORDER.filter(item => {
    return placements.indexOf(item) !== -1
  })

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
  this.leftPositions['left-top'] = positionRootLeft
  this.leftPositions['left-center'] = positionRootLeft
  this.leftPositions['left-bottom'] = positionRootLeft

  let positionRootRight = contentInfo.x + captionSize.width
  positionRootRight = positionRootRight + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.leftPositions['right-top'] = positionRootRight
  this.leftPositions['right-center'] = positionRootRight
  this.leftPositions['right-bottom'] = positionRootRight

  const positionMinorLeft = contentInfo.x
  this.leftPositions['bottom-left'] = positionMinorLeft
  this.leftPositions['top-left'] = positionMinorLeft

  const positionMinorCenter = contentInfo.x - (contentInfo.width / 2) + (captionSize.width / 2)
  this.leftPositions['top-center'] = positionMinorCenter
  this.leftPositions['bottom-center'] = positionMinorCenter

  const positionMinorRight = contentInfo.x - contentInfo.width + captionSize.width
  this.leftPositions['bottom-right'] = positionMinorRight
  this.leftPositions['top-right'] = positionMinorRight
}

function calcTopPositions ({ captionSize, contentInfo, hasArrow }) {
  let positionRootBottom = contentInfo.y + captionSize.height
  positionRootBottom = positionRootBottom + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.topPositions['bottom-left'] = positionRootBottom
  this.topPositions['bottom-center'] = positionRootBottom
  this.topPositions['bottom-right'] = positionRootBottom

  let positionRootTop = contentInfo.y
  positionRootTop = positionRootTop - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.topPositions['top-left'] = positionRootTop
  this.topPositions['top-center'] = positionRootTop
  this.topPositions['top-right'] = positionRootTop

  const positionMinorCenter = contentInfo.y + (captionSize.height / 2) - (contentInfo.height / 2)
  this.topPositions['left-center'] = positionMinorCenter
  this.topPositions['right-center'] = positionMinorCenter

  this.topPositions['left-top'] = contentInfo.y
  this.topPositions['right-top'] = contentInfo.y

  this.topPositions['left-bottom'] = contentInfo.y + captionSize.height
  this.topPositions['right-bottom'] = contentInfo.y + captionSize.height
}

function calcLeftPositionsArrow ({ contentInfo }) {
  this.arrowLeftPositions['top-left'] = 10
  this.arrowLeftPositions['bottom-left'] = 10

  let positionMinorRight = contentInfo.width - (ARROW_SIZE * 2) - 10
  this.arrowLeftPositions['top-right'] = positionMinorRight
  this.arrowLeftPositions['bottom-right'] = positionMinorRight

  let positionMinorCenter = (contentInfo.width / 2) - ARROW_SIZE
  this.arrowLeftPositions['top-center'] = positionMinorCenter
  this.arrowLeftPositions['bottom-center'] = positionMinorCenter

  this.arrowLeftPositions['left-center'] = '100%'
  this.arrowLeftPositions['left-top'] = '100%'
  this.arrowLeftPositions['left-bottom'] = '100%'

  this.arrowLeftPositions['right-top'] = -(ARROW_SIZE * 2)
  this.arrowLeftPositions['right-center'] = -(ARROW_SIZE * 2)
  this.arrowLeftPositions['right-bottom'] = -(ARROW_SIZE * 2)
}

function calcTopPositionsArrow ({ contentInfo }) {
  this.arrowTopPositions['top-left'] = '100%'
  this.arrowTopPositions['top-center'] = '100%'
  this.arrowTopPositions['top-right'] = '100%'

  const positionRootCenter = (contentInfo.height / 2) - ARROW_SIZE
  this.arrowTopPositions['left-center'] = positionRootCenter
  this.arrowTopPositions['right-center'] = positionRootCenter

  this.arrowTopPositions['bottom-left'] = -(ARROW_SIZE * 2)
  this.arrowTopPositions['bottom-center'] = -(ARROW_SIZE * 2)
  this.arrowTopPositions['bottom-right'] = -(ARROW_SIZE * 2)

  this.arrowTopPositions['left-top'] = 10
  this.arrowTopPositions['right-top'] = 10

  this.arrowTopPositions['left-bottom'] = contentInfo.height - (ARROW_SIZE * 2) - 10
  this.arrowTopPositions['right-bottom'] = contentInfo.height - (ARROW_SIZE * 2) - 10
}

function prepareTopPositions ({ contentInfo }) {
  this.prepareTopPositions = { ...this.topPositions }
  this.prepareTopPositions['top-left'] -= contentInfo.height
  this.prepareTopPositions['top-center'] -= contentInfo.height
  this.prepareTopPositions['top-right'] -= contentInfo.height
  this.prepareTopPositions['right-bottom'] -= contentInfo.height
  this.prepareTopPositions['left-bottom'] -= contentInfo.height
}

function prepareLeftPositions ({ contentInfo }) {
  this.prepareLeftPositions = { ...this.leftPositions }
  this.prepareLeftPositions['left-top'] -= contentInfo.width
  this.prepareLeftPositions['left-center'] -= contentInfo.width
  this.prepareLeftPositions['left-bottom'] -= contentInfo.width
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
