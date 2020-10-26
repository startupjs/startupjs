const POPOVER_MARGIN = 8
const ARROW_MARGIN = 10
const ARROW_SIZE = 8

export default {
  placementOrder: [
    'top-left',
    'top-center',
    'top-right',
    'right-top',
    'right-center',
    'right-bottom',
    'bottom-right',
    'bottom-center',
    'bottom-left',
    'left-bottom',
    'left-center',
    'left-top'
  ],

  leftPositions: {},
  topPositions: {},
  arrowLeftPositions: {},
  arrowTopPositions: {},

  getLeftPosition ({
    placement,
    contentInfo,
    captionSize,
    wrapperStyle,
    hasWidthCaption,
    hasArrow
  }) {
    if (hasWidthCaption) return contentInfo.x

    let positionRootLeft = contentInfo.x - wrapperStyle.width
    positionRootLeft = positionRootLeft - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    this.leftPositions['left-center'] = positionRootLeft

    let positionRootRight = contentInfo.x + captionSize.width
    positionRootRight = positionRootRight + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    this.leftPositions['right-center'] = positionRootRight

    const positionMinorLeft = contentInfo.x
    this.leftPositions['bottom-left'] = positionMinorLeft
    this.leftPositions['top-left'] = positionMinorLeft

    const positionMinorCenter = contentInfo.x - (wrapperStyle.width / 2) + (captionSize.width / 2)
    this.leftPositions['top-center'] = positionMinorCenter
    this.leftPositions['bottom-center'] = positionMinorCenter

    const positionMinorRight = contentInfo.x - wrapperStyle.width + captionSize.width
    this.leftPositions['bottom-right'] = positionMinorRight
    this.leftPositions['top-right'] = positionMinorRight

    return this.getValidLeftPosition(placement)
  },

  getTopPosition ({
    cy,
    placement,
    curHeight,
    captionSize,
    hasArrow,
    animateType
  }) {
    const offset = animateType === 'slide' ? 20 : 0

    let positionRootBottom = cy - offset
    positionRootBottom = positionRootBottom + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    this.topPositions['bottom-left'] = positionRootBottom
    this.topPositions['bottom-center'] = positionRootBottom
    this.topPositions['bottom-right'] = positionRootBottom

    let positionRootTop = cy - captionSize.height
    if (animateType === 'scale') positionRootTop = positionRootTop - curHeight
    positionRootTop = positionRootTop - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    this.topPositions['top-left'] = positionRootTop
    this.topPositions['top-center'] = positionRootTop
    this.topPositions['top-right'] = positionRootTop

    const positionMinorCenter = (cy - offset) - (curHeight / 2) - (captionSize.height / 2)
    this.topPositions['left-center'] = positionMinorCenter
    this.topPositions['right-center'] = positionMinorCenter

    return this.getValidTopPosition(placement)
  },

  getLeftPositionArrow ({
    placement,
    contentInfo,
    captionSize,
    isShtampInit,
    shtampStatus
  }) {
    if (!isShtampInit(shtampStatus)) return
    let positionLC = contentInfo.x - ARROW_SIZE - POPOVER_MARGIN
    this.arrowLeftPositions['left-center'] = positionLC

    let positionRC = contentInfo.x + captionSize.width
    this.arrowLeftPositions['right-center'] = positionRC

    let positionRootLeft = contentInfo.x + ARROW_MARGIN
    this.arrowLeftPositions['top-left'] = positionRootLeft
    this.arrowLeftPositions['bottom-left'] = positionRootLeft

    let positionMinorRight = (contentInfo.x + captionSize.width) - (ARROW_SIZE * 2) - ARROW_MARGIN
    this.arrowLeftPositions['top-right'] = positionMinorRight
    this.arrowLeftPositions['bottom-right'] = positionMinorRight

    let positionMinorCenter = contentInfo.x + (captionSize.width / 2) - ARROW_SIZE
    this.arrowLeftPositions['top-center'] = positionMinorCenter
    this.arrowLeftPositions['bottom-center'] = positionMinorCenter

    return this.getValidLeftPositionArrow(placement)
  },

  getTopPositionArrow ({
    placement,
    animateType,
    contentInfo,
    captionSize,
    isShtampInit,
    shtampStatus
  }) {
    if (!isShtampInit(shtampStatus)) return
    // const curTop = animateType === 'slide' ? animateTop._value + 20 : animateTop._value

    const positionRootTop = contentInfo.y - captionSize.height - POPOVER_MARGIN - ARROW_SIZE
    this.arrowTopPositions['top-left'] = positionRootTop
    this.arrowTopPositions['top-center'] = positionRootTop
    this.arrowTopPositions['top-right'] = positionRootTop

    const positionRootCenter = contentInfo.y - (captionSize.height / 2) - ARROW_SIZE
    this.arrowTopPositions['left-center'] = positionRootCenter
    this.arrowTopPositions['right-center'] = positionRootCenter

    const positionRootBottom = contentInfo.y
    this.arrowTopPositions['bottom-left'] = positionRootBottom
    this.arrowTopPositions['bottom-center'] = positionRootBottom
    this.arrowTopPositions['bottom-right'] = positionRootBottom

    return this.getValidTopPositionArrow(placement)
  },

  getValidLeftPosition (placement) {
    return this.leftPositions[placement]
  },

  getValidTopPosition (placement) {
    return this.topPositions[placement]
  },

  getValidLeftPositionArrow (placement) {
    return this.arrowLeftPositions[placement]
  },

  getValidTopPositionArrow (placement) {
    return this.arrowTopPositions[placement]
  }

}
