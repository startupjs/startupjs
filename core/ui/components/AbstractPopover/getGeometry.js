import { Dimensions } from 'react-native'
import CONSTANTS from './constants.json'

const {
  PLACEMENTS_ORDER,
  ARROW_SIZE,
  POSITIONS_REVERSE,
  POPOVER_MARGIN
} = CONSTANTS

export default function getGeometry (params) {
  const {
    placement,
    placements,
    matchAnchorWidth,
    tetherMeasures,
    anchorMeasures
  } = params
  const topPositions = getTopPositions(params)
  const leftPositions = getLeftPositions(params)
  const arrowTopPositions = getTopPositionsArrow(params)
  const arrowLeftPositions = getLeftPositionsArrow(params)
  const preparedPlacements = preparePlacements({ placement, placements })
  const currentPlacement = findAvailablePlacement({
    tetherMeasures,
    placement,
    placements: preparedPlacements,
    leftPositions,
    topPositions,
    initPlacement: placement
  })

  const [currentPosition, currentAttachment] = currentPlacement.split('-')

  const geometry = {
    placement: currentPlacement,
    position: currentPosition,
    attachment: currentAttachment,
    top: topPositions[currentPlacement],
    left: leftPositions[currentPlacement],
    arrowTop: arrowTopPositions[currentPlacement],
    arrowLeft: arrowLeftPositions[currentPlacement],
    width: matchAnchorWidth ? anchorMeasures.width : tetherMeasures.width
  }

  return geometry
}

function getLeftPositions ({ tetherMeasures, anchorMeasures, arrow, dimensions }) {
  const leftPositions = {}

  const halfContent = tetherMeasures.width / 2
  const halfCaption = anchorMeasures.width / 2

  const overRight = dimensions.width - tetherMeasures.width

  const positionMinorLeft = anchorMeasures.pageX
  if (positionMinorLeft + tetherMeasures.width > dimensions.width) {
    leftPositions['bottom-start'] = overRight
    leftPositions['top-start'] = overRight
  } else {
    leftPositions['bottom-start'] = positionMinorLeft
    leftPositions['top-start'] = positionMinorLeft
  }

  const positionMinorCenter = anchorMeasures.pageX - halfContent + halfCaption
  if (positionMinorCenter < 0) {
    leftPositions['top-center'] = 0
    leftPositions['bottom-center'] = 0
  } else if (positionMinorCenter + tetherMeasures.width > dimensions.width) {
    leftPositions['top-center'] = overRight
    leftPositions['bottom-center'] = overRight
  } else {
    leftPositions['top-center'] = positionMinorCenter
    leftPositions['bottom-center'] = positionMinorCenter
  }

  const positionMinorRight = anchorMeasures.pageX - tetherMeasures.width + anchorMeasures.width
  if (positionMinorRight < 0) {
    leftPositions['bottom-end'] = 0
    leftPositions['top-end'] = 0
  } else {
    leftPositions['bottom-end'] = positionMinorRight
    leftPositions['top-end'] = positionMinorRight
  }

  const positionRootLeft = anchorMeasures.pageX - tetherMeasures.width - (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  leftPositions['left-start'] = positionRootLeft
  leftPositions['left-center'] = positionRootLeft
  leftPositions['left-end'] = positionRootLeft

  const positionRootRight = anchorMeasures.pageX + anchorMeasures.width + (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  leftPositions['right-start'] = positionRootRight
  leftPositions['right-center'] = positionRootRight
  leftPositions['right-end'] = positionRootRight

  return leftPositions
}

function getTopPositions ({ anchorMeasures, tetherMeasures, arrow, dimensions }) {
  const topPositions = {}

  const halfCaption = anchorMeasures.height / 2
  const halfContent = tetherMeasures.height / 2

  const positionRootBottom = anchorMeasures.pageY + anchorMeasures.height + (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  topPositions['bottom-start'] = positionRootBottom
  topPositions['bottom-center'] = positionRootBottom
  topPositions['bottom-end'] = positionRootBottom

  const positionRootTop = anchorMeasures.pageY - tetherMeasures.height - (arrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
  topPositions['top-start'] = positionRootTop
  topPositions['top-center'] = positionRootTop
  topPositions['top-end'] = positionRootTop

  const positionMinorCenter = anchorMeasures.pageY + halfCaption - halfContent
  if (positionMinorCenter < 0) {
    topPositions['left-center'] = 0
    topPositions['right-center'] = 0
  } else if (anchorMeasures.pageY + halfContent > dimensions.height) {
    const positionMinorCenterOverBottom = dimensions.height - tetherMeasures.height
    topPositions['left-center'] = positionMinorCenterOverBottom
    topPositions['right-center'] = positionMinorCenterOverBottom
  } else {
    topPositions['left-center'] = positionMinorCenter
    topPositions['right-center'] = positionMinorCenter
  }

  if (anchorMeasures.pageY + tetherMeasures.height > dimensions.height) {
    const positionMinorStartOver = dimensions.height - tetherMeasures.height
    topPositions['left-start'] = positionMinorStartOver
    topPositions['right-start'] = positionMinorStartOver
  } else {
    topPositions['left-start'] = anchorMeasures.pageY
    topPositions['right-start'] = anchorMeasures.pageY
  }

  if (anchorMeasures.pageY + anchorMeasures.height - tetherMeasures.height < 0) {
    topPositions['left-end'] = 0
    topPositions['right-end'] = 0
  } else {
    const positionMinorEnd = anchorMeasures.pageY + anchorMeasures.height - tetherMeasures.height
    topPositions['left-end'] = positionMinorEnd
    topPositions['right-end'] = positionMinorEnd
  }

  return topPositions
}

function getLeftPositionsArrow ({ tetherMeasures, anchorMeasures, dimensions }) {
  const arrowLeftPositions = {}

  const halfContent = tetherMeasures.width / 2
  const halfCaption = anchorMeasures.width / 2

  const overLeft = anchorMeasures.pageX + halfCaption - ARROW_SIZE
  const overRight = tetherMeasures.width - (dimensions.width - anchorMeasures.pageX) + halfCaption - ARROW_SIZE
  const minRight = tetherMeasures.width - (ARROW_SIZE * 3)

  if (anchorMeasures.pageX + tetherMeasures.width > dimensions.width) {
    if (anchorMeasures.pageX + anchorMeasures.width > dimensions.width) {
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

  if (anchorMeasures.pageX - tetherMeasures.width + anchorMeasures.width < 0) {
    if (anchorMeasures.pageX < 0) {
      arrowLeftPositions['top-end'] = ARROW_SIZE
      arrowLeftPositions['bottom-end'] = ARROW_SIZE
    } else {
      arrowLeftPositions['top-end'] = overLeft
      arrowLeftPositions['bottom-end'] = overLeft
    }
  } else {
    const positionEnd = tetherMeasures.width - (ARROW_SIZE * 3)
    arrowLeftPositions['top-end'] = positionEnd
    arrowLeftPositions['bottom-end'] = positionEnd
  }

  if (anchorMeasures.pageX - halfContent + halfCaption < 0) {
    if (anchorMeasures.pageX < 0) {
      arrowLeftPositions['top-center'] = ARROW_SIZE
      arrowLeftPositions['bottom-center'] = ARROW_SIZE
    } else {
      arrowLeftPositions['top-center'] = overLeft
      arrowLeftPositions['bottom-center'] = overLeft
    }
  } else if (anchorMeasures.pageX + halfContent > dimensions.width) {
    if (anchorMeasures.pageX + anchorMeasures.width > dimensions.width) {
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

function getTopPositionsArrow ({ tetherMeasures, anchorMeasures, dimensions }) {
  const arrowTopPositions = {}

  const halfCaption = anchorMeasures.height / 2
  const halfContent = tetherMeasures.height / 2

  const overTop = anchorMeasures.pageX + halfCaption - ARROW_SIZE
  const overBottom = tetherMeasures.height - (dimensions.height - anchorMeasures.pageX) + halfCaption - ARROW_SIZE
  const minBottom = tetherMeasures.height - (ARROW_SIZE * 3)

  if (anchorMeasures.pageX + halfCaption - halfContent < 0) {
    if (anchorMeasures.pageX < 0) {
      arrowTopPositions['left-center'] = ARROW_SIZE
      arrowTopPositions['right-center'] = ARROW_SIZE
    } else {
      arrowTopPositions['left-center'] = overTop
      arrowTopPositions['right-center'] = overTop
    }
  } else if (anchorMeasures.pageX + halfContent > dimensions.height) {
    if (anchorMeasures.pageX + anchorMeasures.height > dimensions.height) {
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

  if (anchorMeasures.pageX + tetherMeasures.height > dimensions.height) {
    if (anchorMeasures.pageX + anchorMeasures.height > dimensions.height) {
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

  if (anchorMeasures.pageX + anchorMeasures.height - tetherMeasures.height < 0) {
    if (anchorMeasures.pageX < 0) {
      arrowTopPositions['left-end'] = ARROW_SIZE
      arrowTopPositions['right-end'] = ARROW_SIZE
    } else {
      arrowTopPositions['left-end'] = overTop
      arrowTopPositions['right-end'] = overTop
    }
  } else {
    const positionEnd = tetherMeasures.height - (ARROW_SIZE * 3)
    arrowTopPositions['left-end'] = positionEnd
    arrowTopPositions['right-end'] = positionEnd
  }

  arrowTopPositions['top-start'] = tetherMeasures.height
  arrowTopPositions['top-center'] = tetherMeasures.height
  arrowTopPositions['top-end'] = tetherMeasures.height

  const dblArrow = ARROW_SIZE * 2
  arrowTopPositions['bottom-start'] = -dblArrow
  arrowTopPositions['bottom-center'] = -dblArrow
  arrowTopPositions['bottom-end'] = -dblArrow

  return arrowTopPositions
}

// TODO: This is unlogical behaviour.
// We can always find a better position if the specified position does not fit
function preparePlacements ({ placement, placements }) {
  if (placements.length !== PLACEMENTS_ORDER.length) {
    return PLACEMENTS_ORDER.filter(item => {
      return placements.includes(item)
    })
  }

  let _preparePlacements = PLACEMENTS_ORDER

  const activeIndexPlacement = _preparePlacements.findIndex(item => {
    return item === placement
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

// TODO: This is unlogical behaviour.
// We can always find a better position if the specified position does not fit
function findAvailablePlacement (options) {
  const {
    counter = 1,
    tetherMeasures,
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
      _leftPosition + tetherMeasures.width > Dimensions.get('window').width) {
    return findAvailablePlacement({
      ...options,
      counter: counter + 1,
      placement: placements[nextIndex]
    })
  }

  const _topPosition = topPositions[placement]
  if (_topPosition < 0 ||
    _topPosition + tetherMeasures.height > Dimensions.get('window').height) {
    return findAvailablePlacement({
      ...options,
      counter: counter + 1,
      placement: placements[nextIndex]
    })
  }

  return placements[activeIndexPlacement]
}
