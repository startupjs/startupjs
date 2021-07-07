import { Dimensions } from 'react-native'
import {
  PLACEMENTS_ORDER,
  ARROW_SIZE,
  POSITIONS_REVERSE,
  POPOVER_MARGIN
} from '../constants.json'

export default function getGeometry ({
  placement,
  placements,
  contentInfo,
  captionInfo,
  arrow,
  dimensions
}) {
  let leftPositions = getLeftPositions({ contentInfo, captionInfo, arrow, dimensions })
  leftPositions = prepareLeftPositions({ contentInfo, leftPositions })

  let topPositions = getTopPositions({ contentInfo, captionInfo, arrow, dimensions })
  topPositions = prepareTopPositions({ contentInfo, topPositions })

  let arrowLeftPositions = getLeftPositionsArrow({ contentInfo, captionInfo, dimensions })
  let arrowTopPositions = getTopPositionsArrow({ contentInfo, captionInfo, dimensions })

  placements = preparePlacements({ initPlacement: placement, placements })

  const validPlacement = getValidPlacement({
    contentInfo,
    placement,
    placements,
    leftPositions,
    topPositions,
    initPlacement: placement
  })

  return {
    validPlacement,
    captionInfo,
    positionLeft: leftPositions[validPlacement],
    positionTop: topPositions[validPlacement],
    arrowLeftPosition: arrowLeftPositions[validPlacement],
    arrowTopPosition: arrowTopPositions[validPlacement]
  }
}

function getLeftPositions ({ contentInfo, captionInfo, arrow, dimensions }) {
  const leftPositions = {}

  const halfContent = contentInfo.width / 2
  const halfCaption = captionInfo.width / 2

  const overRight = dimensions.width - contentInfo.width

  const positionMinorLeft = captionInfo.x
  if (positionMinorLeft + captionInfo.width > dimensions.width) {
    leftPositions['bottom-start'] = overRight
    leftPositions['top-start'] = overRight
  } else {
    leftPositions['bottom-start'] = positionMinorLeft
    leftPositions['top-start'] = positionMinorLeft
  }

  const positionMinorCenter = captionInfo.x - halfContent + halfCaption
  if (positionMinorCenter < 0) {
    leftPositions['top-center'] = 0
    leftPositions['bottom-center'] = 0
  } else if (positionMinorCenter + contentInfo.width > dimensions.width) {
    leftPositions['top-center'] = overRight
    leftPositions['bottom-center'] = overRight
  } else {
    leftPositions['top-center'] = positionMinorCenter
    leftPositions['bottom-center'] = positionMinorCenter
  }

  const positionMinorRight = captionInfo.x - contentInfo.width + captionInfo.width
  if (positionMinorRight < 0) {
    leftPositions['bottom-end'] = 0
    leftPositions['top-end'] = 0
  } else {
    leftPositions['bottom-end'] = positionMinorRight
    leftPositions['top-end'] = positionMinorRight
  }

  const positionRootLeft = captionInfo.x - (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  leftPositions['left-start'] = positionRootLeft
  leftPositions['left-center'] = positionRootLeft
  leftPositions['left-end'] = positionRootLeft

  const positionRootRight = captionInfo.x + captionInfo.width + (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  leftPositions['right-start'] = positionRootRight
  leftPositions['right-center'] = positionRootRight
  leftPositions['right-end'] = positionRootRight

  return leftPositions
}

function getTopPositions ({ captionInfo, contentInfo, arrow, dimensions }) {
  const topPositions = {}

  const halfCaption = captionInfo.height / 2
  const halfContent = contentInfo.height / 2

  const positionRootBottom = captionInfo.y + captionInfo.height + (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  topPositions['bottom-start'] = positionRootBottom
  topPositions['bottom-center'] = positionRootBottom
  topPositions['bottom-end'] = positionRootBottom

  const positionRootTop = captionInfo.y - (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  topPositions['top-start'] = positionRootTop
  topPositions['top-center'] = positionRootTop
  topPositions['top-end'] = positionRootTop

  const positionMinorCenter = captionInfo.y + halfCaption - halfContent
  if (positionMinorCenter < 0) {
    topPositions['left-center'] = 0
    topPositions['right-center'] = 0
  } else if (captionInfo.y + halfContent > dimensions.height) {
    const positionMinorCenterOverBottom = dimensions.height - contentInfo.height
    topPositions['left-center'] = positionMinorCenterOverBottom
    topPositions['right-center'] = positionMinorCenterOverBottom
  } else {
    topPositions['left-center'] = positionMinorCenter
    topPositions['right-center'] = positionMinorCenter
  }

  if (captionInfo.y + contentInfo.height > dimensions.height) {
    const positionMinorStartOver = dimensions.height - contentInfo.height
    topPositions['left-start'] = positionMinorStartOver
    topPositions['right-start'] = positionMinorStartOver
  } else {
    topPositions['left-start'] = captionInfo.y
    topPositions['right-start'] = captionInfo.y
  }

  if (captionInfo.y + captionInfo.height - contentInfo.height < 0) {
    topPositions['left-end'] = contentInfo.height
    topPositions['right-end'] = contentInfo.height
  } else {
    const positionMinorEnd = captionInfo.y + captionInfo.height
    topPositions['left-end'] = positionMinorEnd
    topPositions['right-end'] = positionMinorEnd
  }

  return topPositions
}

function getLeftPositionsArrow ({ contentInfo, captionInfo, dimensions }) {
  const arrowLeftPositions = {}

  const halfContent = contentInfo.width / 2
  const halfCaption = captionInfo.width / 2

  const overLeft = captionInfo.x + halfCaption - ARROW_SIZE
  const overRight = contentInfo.width - (dimensions.width - captionInfo.x) + halfCaption - ARROW_SIZE
  const minRight = contentInfo.width - (ARROW_SIZE * 3)

  if (captionInfo.x + contentInfo.width > dimensions.width) {
    if (captionInfo.x + captionInfo.width > dimensions.width) {
      arrowLeftPositions['top-start'] = minRight
      arrowLeftPositions['bottom-start'] = minRight
    } else {
      arrowLeftPositions['top-start'] = overRight
      arrowLeftPositions['bottom-start'] = overRight
    }
  } else {
    arrowLeftPositions['top-start'] = ARROW_SIZE
    arrowLeftPositions['bottom-start'] = ARROW_SIZE
  }

  if (captionInfo.x - contentInfo.width + captionInfo.width < 0) {
    if (captionInfo.x < 0) {
      arrowLeftPositions['top-end'] = ARROW_SIZE
      arrowLeftPositions['bottom-end'] = ARROW_SIZE
    } else {
      arrowLeftPositions['top-end'] = overLeft
      arrowLeftPositions['bottom-end'] = overLeft
    }
  } else {
    const positionEnd = contentInfo.width - (ARROW_SIZE * 3)
    arrowLeftPositions['top-end'] = positionEnd
    arrowLeftPositions['bottom-end'] = positionEnd
  }

  if (captionInfo.x - halfContent + halfCaption < 0) {
    if (captionInfo.x < 0) {
      arrowLeftPositions['top-center'] = ARROW_SIZE
      arrowLeftPositions['bottom-center'] = ARROW_SIZE
    } else {
      arrowLeftPositions['top-center'] = overLeft
      arrowLeftPositions['bottom-center'] = overLeft
    }
  } else if (captionInfo.x + halfContent > dimensions.width) {
    if (captionInfo.x + captionInfo.width > dimensions.width) {
      arrowLeftPositions['top-center'] = minRight
      arrowLeftPositions['bottom-center'] = minRight
    } else {
      arrowLeftPositions['top-center'] = overRight
      arrowLeftPositions['bottom-center'] = overRight
    }
  } else {
    const positionCenter = halfContent - ARROW_SIZE
    arrowLeftPositions['top-center'] = positionCenter
    arrowLeftPositions['bottom-center'] = positionCenter
  }

  arrowLeftPositions['left-center'] = '100%'
  arrowLeftPositions['left-start'] = '100%'
  arrowLeftPositions['left-end'] = '100%'

  const dblArrow = ARROW_SIZE * 2
  arrowLeftPositions['right-start'] = -dblArrow
  arrowLeftPositions['right-center'] = -dblArrow
  arrowLeftPositions['right-end'] = -dblArrow

  return arrowLeftPositions
}

function getTopPositionsArrow ({ contentInfo, captionInfo, dimensions }) {
  const arrowTopPositions = {}

  const halfCaption = captionInfo.height / 2
  const halfContent = contentInfo.height / 2

  const overTop = captionInfo.y + halfCaption - ARROW_SIZE
  const overBottom = contentInfo.height - (dimensions.height - captionInfo.y) + halfCaption - ARROW_SIZE
  const minBottom = contentInfo.height - (ARROW_SIZE * 3)

  if (captionInfo.y + halfCaption - halfContent < 0) {
    if (captionInfo.y < 0) {
      arrowTopPositions['left-center'] = ARROW_SIZE
      arrowTopPositions['right-center'] = ARROW_SIZE
    } else {
      arrowTopPositions['left-center'] = overTop
      arrowTopPositions['right-center'] = overTop
    }
  } else if (captionInfo.y + halfContent > dimensions.height) {
    if (captionInfo.y + captionInfo.height > dimensions.height) {
      arrowTopPositions['left-center'] = minBottom
      arrowTopPositions['right-center'] = minBottom
    } else {
      arrowTopPositions['left-center'] = overBottom
      arrowTopPositions['right-center'] = overBottom
    }
  } else {
    const positionCenter = halfContent - ARROW_SIZE
    arrowTopPositions['left-center'] = positionCenter
    arrowTopPositions['right-center'] = positionCenter
  }

  if (captionInfo.y + contentInfo.height > dimensions.height) {
    if (captionInfo.y + captionInfo.height > dimensions.height) {
      arrowTopPositions['left-start'] = minBottom
      arrowTopPositions['right-start'] = minBottom
    } else {
      arrowTopPositions['left-start'] = overBottom
      arrowTopPositions['right-start'] = overBottom
    }
  } else {
    const positionStart = ARROW_SIZE
    arrowTopPositions['left-start'] = positionStart
    arrowTopPositions['right-start'] = positionStart
  }

  if (captionInfo.y + captionInfo.height - contentInfo.height < 0) {
    if (captionInfo.y < 0) {
      arrowTopPositions['left-end'] = ARROW_SIZE
      arrowTopPositions['right-end'] = ARROW_SIZE
    } else {
      arrowTopPositions['left-end'] = overTop
      arrowTopPositions['right-end'] = overTop
    }
  } else {
    const positionEnd = contentInfo.height - (ARROW_SIZE * 3)
    arrowTopPositions['left-end'] = positionEnd
    arrowTopPositions['right-end'] = positionEnd
  }

  arrowTopPositions['top-start'] = contentInfo.height
  arrowTopPositions['top-center'] = contentInfo.height
  arrowTopPositions['top-end'] = contentInfo.height

  const dblArrow = ARROW_SIZE * 2
  arrowTopPositions['bottom-start'] = -dblArrow
  arrowTopPositions['bottom-center'] = -dblArrow
  arrowTopPositions['bottom-end'] = -dblArrow

  return arrowTopPositions
}

function prepareTopPositions ({ topPositions, contentInfo }) {
  const _topPositions = { ...topPositions }

  _topPositions['top-start'] -= contentInfo.height
  _topPositions['top-center'] -= contentInfo.height
  _topPositions['top-end'] -= contentInfo.height
  _topPositions['right-end'] -= contentInfo.height
  _topPositions['left-end'] -= contentInfo.height

  return _topPositions
}

function prepareLeftPositions ({ leftPositions, contentInfo }) {
  const _leftPositions = { ...leftPositions }

  _leftPositions['left-start'] -= contentInfo.width
  _leftPositions['left-center'] -= contentInfo.width
  _leftPositions['left-end'] -= contentInfo.width

  return _leftPositions
}

function preparePlacements ({ initPlacement, placements }) {
  if (placements.length !== PLACEMENTS_ORDER.length) {
    return PLACEMENTS_ORDER.filter(item => {
      return placements.indexOf(item) !== -1
    })
  }

  let _preparePlacements = PLACEMENTS_ORDER

  const activeIndexPlacement = _preparePlacements.findIndex(item => {
    return item === initPlacement
  })

  const [position, attachment] = _preparePlacements[activeIndexPlacement].split('-')
  const reversePlacement = `${POSITIONS_REVERSE[position]}-${attachment}`
  const reverseIndexPlacement = _preparePlacements.findIndex(item => {
    return item === reversePlacement
  })
  _preparePlacements = _preparePlacements.filter(item => {
    return item !== reversePlacement
  })

  _preparePlacements = [
    ..._preparePlacements.slice(0, activeIndexPlacement),
    PLACEMENTS_ORDER[reverseIndexPlacement],
    ..._preparePlacements.slice(activeIndexPlacement)
  ]

  return _preparePlacements
}

function getValidPlacement (options) {
  const {
    counter = 1,
    contentInfo,
    placement,
    placements,
    leftPositions,
    topPositions,
    initPlacement
  } = options

  if (counter > placements.length) {
    return initPlacement
  }

  const activeIndexPlacement = placements.findIndex(item => {
    return item === placement
  })

  let nextIndex = activeIndexPlacement + 1
  if (nextIndex > placements.length - 1) nextIndex = 0

  const _leftPosition = leftPositions[placement]
  if (_leftPosition < 0 ||
      _leftPosition + contentInfo.width > Dimensions.get('window').width) {
    return getValidPlacement({
      counter: counter + 1,
      placement: placements[nextIndex],
      ...options
    })
  }

  const _topPosition = topPositions[placement]
  if (_topPosition < 0 ||
    _topPosition + contentInfo.height > Dimensions.get('window').height) {
    return getValidPlacement({
      counter: counter + 1,
      placement: placements[nextIndex],
      ...options
    })
  }

  return placements[activeIndexPlacement]
}
