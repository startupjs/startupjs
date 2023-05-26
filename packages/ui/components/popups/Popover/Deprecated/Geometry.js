import { Dimensions } from 'react-native'
import CONSTANTS from '../constants.json'

const {
  PLACEMENTS_ORDER,
  ARROW_SIZE,
  POSITIONS_REVERSE,
  POPOVER_MARGIN
} = CONSTANTS

function Geometry ({
  placement,
  placements,
  contentInfo,
  captionInfo,
  arrow,
  dimensions
}) {
  this.initPlacement = placement
  this.leftPositions = {}
  this.topPositions = {}
  this.arrowLeftPositions = {}
  this.arrowTopPositions = {}

  calcLeftPositions.call(this, { contentInfo, captionInfo, arrow, dimensions })
  calcTopPositions.call(this, { contentInfo, captionInfo, arrow, dimensions })

  calcLeftPositionsArrow.call(this, contentInfo, captionInfo, dimensions)
  calcTopPositionsArrow.call(this, contentInfo, captionInfo, dimensions)

  prepareTopPositions.call(this, contentInfo)
  prepareLeftPositions.call(this, contentInfo)
  preparePlacements.call(this, placements)

  this.getValidPlacement = getValidPlacement
  this.validPlacement = this.getValidPlacement(placement, contentInfo)
  this.positionLeft = this.leftPositions[this.validPlacement]
  this.positionTop = this.topPositions[this.validPlacement]
  this.arrowLeftPosition = this.arrowLeftPositions[this.validPlacement]
  this.arrowTopPosition = this.arrowTopPositions[this.validPlacement]
}

function calcLeftPositions ({ contentInfo, captionInfo, arrow, dimensions }) {
  const halfContent = contentInfo.width / 2
  const halfCaption = captionInfo.width / 2

  const overRight = dimensions.width - contentInfo.width

  const positionMinorLeft = contentInfo.x
  if (positionMinorLeft + contentInfo.width > dimensions.width) {
    this.leftPositions['bottom-start'] = overRight
    this.leftPositions['top-start'] = overRight
  } else {
    this.leftPositions['bottom-start'] = positionMinorLeft
    this.leftPositions['top-start'] = positionMinorLeft
  }

  const positionMinorCenter = contentInfo.x - halfContent + halfCaption
  if (positionMinorCenter < 0) {
    this.leftPositions['top-center'] = 0
    this.leftPositions['bottom-center'] = 0
  } else if (positionMinorCenter + contentInfo.width > dimensions.width) {
    this.leftPositions['top-center'] = overRight
    this.leftPositions['bottom-center'] = overRight
  } else {
    this.leftPositions['top-center'] = positionMinorCenter
    this.leftPositions['bottom-center'] = positionMinorCenter
  }

  const positionMinorRight = contentInfo.x - contentInfo.width + captionInfo.width
  if (positionMinorRight < 0) {
    this.leftPositions['bottom-end'] = 0
    this.leftPositions['top-end'] = 0
  } else {
    this.leftPositions['bottom-end'] = positionMinorRight
    this.leftPositions['top-end'] = positionMinorRight
  }

  const positionRootLeft = contentInfo.x - (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.leftPositions['left-start'] = positionRootLeft
  this.leftPositions['left-center'] = positionRootLeft
  this.leftPositions['left-end'] = positionRootLeft

  const positionRootRight = contentInfo.x + captionInfo.width + (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.leftPositions['right-start'] = positionRootRight
  this.leftPositions['right-center'] = positionRootRight
  this.leftPositions['right-end'] = positionRootRight
}

function calcTopPositions ({ captionInfo, contentInfo, arrow, dimensions }) {
  const halfCaption = captionInfo.height / 2
  const halfContent = contentInfo.height / 2
  const positionRootBottom = captionInfo.y + captionInfo.height + (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.topPositions['bottom-start'] = positionRootBottom
  this.topPositions['bottom-center'] = positionRootBottom
  this.topPositions['bottom-end'] = positionRootBottom

  const positionRootTop = captionInfo.y - (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  this.topPositions['top-start'] = positionRootTop
  this.topPositions['top-center'] = positionRootTop
  this.topPositions['top-end'] = positionRootTop

  const positionMinorCenter = captionInfo.y + halfCaption - halfContent
  if (positionMinorCenter < 0) {
    this.topPositions['left-center'] = 0
    this.topPositions['right-center'] = 0
  } else if (captionInfo.y + halfContent > dimensions.height) {
    const positionMinorCenterOverBottom = dimensions.height - contentInfo.height
    this.topPositions['left-center'] = positionMinorCenterOverBottom
    this.topPositions['right-center'] = positionMinorCenterOverBottom
  } else {
    this.topPositions['left-center'] = positionMinorCenter
    this.topPositions['right-center'] = positionMinorCenter
  }

  if (captionInfo.y + contentInfo.height > dimensions.height) {
    const positionMinorStartOver = dimensions.height - contentInfo.height
    this.topPositions['left-start'] = positionMinorStartOver
    this.topPositions['right-start'] = positionMinorStartOver
  } else {
    this.topPositions['left-start'] = captionInfo.y
    this.topPositions['right-start'] = captionInfo.y
  }

  if (captionInfo.y + captionInfo.height - contentInfo.height < 0) {
    this.topPositions['left-end'] = contentInfo.height
    this.topPositions['right-end'] = contentInfo.height
  } else {
    const positionMinorEnd = captionInfo.y + captionInfo.height
    this.topPositions['left-end'] = positionMinorEnd
    this.topPositions['right-end'] = positionMinorEnd
  }
}

function calcLeftPositionsArrow (contentInfo, captionInfo, dimensions) {
  const halfContent = contentInfo.width / 2
  const halfCaption = captionInfo.width / 2

  const overLeft = captionInfo.x + halfCaption - ARROW_SIZE
  const overRight = contentInfo.width - (dimensions.width - captionInfo.x) + halfCaption - ARROW_SIZE
  const minRight = contentInfo.width - (ARROW_SIZE * 3)

  if (captionInfo.x + contentInfo.width > dimensions.width) {
    if (captionInfo.x + captionInfo.width > dimensions.width) {
      this.arrowLeftPositions['top-start'] = minRight
      this.arrowLeftPositions['bottom-start'] = minRight
    } else {
      this.arrowLeftPositions['top-start'] = overRight
      this.arrowLeftPositions['bottom-start'] = overRight
    }
  } else {
    this.arrowLeftPositions['top-start'] = ARROW_SIZE
    this.arrowLeftPositions['bottom-start'] = ARROW_SIZE
  }

  if (captionInfo.x - contentInfo.width + captionInfo.width < 0) {
    if (captionInfo.x < 0) {
      this.arrowLeftPositions['top-end'] = ARROW_SIZE
      this.arrowLeftPositions['bottom-end'] = ARROW_SIZE
    } else {
      this.arrowLeftPositions['top-end'] = overLeft
      this.arrowLeftPositions['bottom-end'] = overLeft
    }
  } else {
    const positionEnd = contentInfo.width - (ARROW_SIZE * 3)
    this.arrowLeftPositions['top-end'] = positionEnd
    this.arrowLeftPositions['bottom-end'] = positionEnd
  }

  if (captionInfo.x - halfContent + halfCaption < 0) {
    if (captionInfo.x < 0) {
      this.arrowLeftPositions['top-center'] = ARROW_SIZE
      this.arrowLeftPositions['bottom-center'] = ARROW_SIZE
    } else {
      this.arrowLeftPositions['top-center'] = overLeft
      this.arrowLeftPositions['bottom-center'] = overLeft
    }
  } else if (captionInfo.x + halfContent > dimensions.width) {
    if (captionInfo.x + captionInfo.width > dimensions.width) {
      this.arrowLeftPositions['top-center'] = minRight
      this.arrowLeftPositions['bottom-center'] = minRight
    } else {
      this.arrowLeftPositions['top-center'] = overRight
      this.arrowLeftPositions['bottom-center'] = overRight
    }
  } else {
    const positionCenter = halfContent - ARROW_SIZE
    this.arrowLeftPositions['top-center'] = positionCenter
    this.arrowLeftPositions['bottom-center'] = positionCenter
  }

  this.arrowLeftPositions['left-center'] = '100%'
  this.arrowLeftPositions['left-start'] = '100%'
  this.arrowLeftPositions['left-end'] = '100%'

  const dblArrow = ARROW_SIZE * 2
  this.arrowLeftPositions['right-start'] = -dblArrow
  this.arrowLeftPositions['right-center'] = -dblArrow
  this.arrowLeftPositions['right-end'] = -dblArrow
}

function calcTopPositionsArrow (contentInfo, captionInfo, dimensions) {
  const halfCaption = captionInfo.height / 2
  const halfContent = contentInfo.height / 2

  const overTop = captionInfo.y + halfCaption - ARROW_SIZE
  const overBottom = contentInfo.height - (dimensions.height - captionInfo.y) + halfCaption - ARROW_SIZE
  const minBottom = contentInfo.height - (ARROW_SIZE * 3)

  if (captionInfo.y + halfCaption - halfContent < 0) {
    if (captionInfo.y < 0) {
      this.arrowTopPositions['left-center'] = ARROW_SIZE
      this.arrowTopPositions['right-center'] = ARROW_SIZE
    } else {
      this.arrowTopPositions['left-center'] = overTop
      this.arrowTopPositions['right-center'] = overTop
    }
  } else if (captionInfo.y + halfContent > dimensions.height) {
    if (captionInfo.y + captionInfo.height > dimensions.height) {
      this.arrowTopPositions['left-center'] = minBottom
      this.arrowTopPositions['right-center'] = minBottom
    } else {
      this.arrowTopPositions['left-center'] = overBottom
      this.arrowTopPositions['right-center'] = overBottom
    }
  } else {
    const positionCenter = halfContent - ARROW_SIZE
    this.arrowTopPositions['left-center'] = positionCenter
    this.arrowTopPositions['right-center'] = positionCenter
  }

  if (captionInfo.y + contentInfo.height > dimensions.height) {
    if (captionInfo.y + captionInfo.height > dimensions.height) {
      this.arrowTopPositions['left-start'] = minBottom
      this.arrowTopPositions['right-start'] = minBottom
    } else {
      this.arrowTopPositions['left-start'] = overBottom
      this.arrowTopPositions['right-start'] = overBottom
    }
  } else {
    const positionStart = ARROW_SIZE
    this.arrowTopPositions['left-start'] = positionStart
    this.arrowTopPositions['right-start'] = positionStart
  }

  if (captionInfo.y + captionInfo.height - contentInfo.height < 0) {
    if (captionInfo.y < 0) {
      this.arrowTopPositions['left-end'] = ARROW_SIZE
      this.arrowTopPositions['right-end'] = ARROW_SIZE
    } else {
      this.arrowTopPositions['left-end'] = overTop
      this.arrowTopPositions['right-end'] = overTop
    }
  } else {
    const positionEnd = contentInfo.height - (ARROW_SIZE * 3)
    this.arrowTopPositions['left-end'] = positionEnd
    this.arrowTopPositions['right-end'] = positionEnd
  }

  this.arrowTopPositions['top-start'] = contentInfo.height
  this.arrowTopPositions['top-center'] = contentInfo.height
  this.arrowTopPositions['top-end'] = contentInfo.height

  const dblArrow = ARROW_SIZE * 2
  this.arrowTopPositions['bottom-start'] = -dblArrow
  this.arrowTopPositions['bottom-center'] = -dblArrow
  this.arrowTopPositions['bottom-end'] = -dblArrow
}

function prepareTopPositions (contentInfo) {
  this.prepareTopPositions = { ...this.topPositions }
  this.prepareTopPositions['top-start'] -= contentInfo.height
  this.prepareTopPositions['top-center'] -= contentInfo.height
  this.prepareTopPositions['top-end'] -= contentInfo.height
  this.prepareTopPositions['right-end'] -= contentInfo.height
  this.prepareTopPositions['left-end'] -= contentInfo.height
}

function prepareLeftPositions (contentInfo) {
  this.prepareLeftPositions = { ...this.leftPositions }
  this.prepareLeftPositions['left-start'] -= contentInfo.width
  this.prepareLeftPositions['left-center'] -= contentInfo.width
  this.prepareLeftPositions['left-end'] -= contentInfo.width
}

function preparePlacements (placements) {
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

function getValidPlacement (placement, contentInfo) {
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
    return this.getValidPlacement(
      this.preparePlacements[nextIndex],
      contentInfo
    )
  }

  const _topPosition = this.prepareTopPositions[placement]
  if (_topPosition < 0 ||
    _topPosition + contentInfo.height > Dimensions.get('window').height) {
    return this.getValidPlacement(
      this.preparePlacements[nextIndex],
      contentInfo
    )
  }

  return this.preparePlacements[activeIndexPlacement]
}

export default Geometry
