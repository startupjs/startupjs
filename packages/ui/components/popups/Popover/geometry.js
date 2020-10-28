import { Dimensions } from 'react-native'

const POPOVER_MARGIN = 8
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

  getPositions ({
    placement,
    cy,
    contentInfo,
    captionSize,
    hasWidthCaption,
    hasArrow,
    curHeight,
    curWidth,
    animateType
  }) {
    this.calcLeftPosition({
      contentInfo,
      captionSize,
      hasWidthCaption,
      hasArrow,
      curWidth,
      curHeight
    })

    this.calcTopPosition({
      cy,
      curHeight,
      captionSize,
      hasArrow,
      animateType
    })

    this.calcLeftPositionArrow({ curWidth })
    this.calcTopPositionArrow({ curHeight })

    const validPlacement = this.getValidPlacement({
      placement,
      curHeight,
      curWidth
    })

    return {
      positionLeft: this.leftPositions[validPlacement],
      positionTop: this.topPositions[validPlacement],
      validPlacement
    }
  },

  calcLeftPosition ({
    contentInfo,
    captionSize,
    hasWidthCaption,
    hasArrow,
    curWidth
  }) {
    if (hasWidthCaption) {
      this.placementOrder.forEach(placement => {
        this.leftPositions[placement] = contentInfo.x
      })
    }

    let positionRootLeft = contentInfo.x - curWidth
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

    const positionMinorCenter = contentInfo.x - (curWidth / 2) + (captionSize.width / 2)
    this.leftPositions['top-center'] = positionMinorCenter
    this.leftPositions['bottom-center'] = positionMinorCenter

    const positionMinorRight = contentInfo.x - curWidth + captionSize.width
    this.leftPositions['bottom-right'] = positionMinorRight
    this.leftPositions['top-right'] = positionMinorRight
  },

  calcTopPosition ({
    cy,
    curHeight,
    captionSize,
    hasArrow,
    animateType
  }) {
    let positionRootBottom = cy
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

    const positionMinorCenter = cy - (curHeight / 2) - (captionSize.height / 2)
    this.topPositions['left-center'] = positionMinorCenter
    this.topPositions['right-center'] = positionMinorCenter

    const positionMinorTop = cy - captionSize.height
    this.topPositions['left-top'] = positionMinorTop
    this.topPositions['right-top'] = positionMinorTop

    const positionMinorBottom = cy - curHeight
    this.topPositions['left-bottom'] = positionMinorBottom
    this.topPositions['right-bottom'] = positionMinorBottom
  },

  calcLeftPositionArrow ({ curWidth }) {
    this.arrowLeftPositions['top-left'] = 10
    this.arrowLeftPositions['bottom-left'] = 10

    let positionMinorRight = curWidth - (ARROW_SIZE * 2) - 10
    this.arrowLeftPositions['top-right'] = positionMinorRight
    this.arrowLeftPositions['bottom-right'] = positionMinorRight

    let positionMinorCenter = (curWidth / 2) - ARROW_SIZE
    this.arrowLeftPositions['top-center'] = positionMinorCenter
    this.arrowLeftPositions['bottom-center'] = positionMinorCenter

    this.arrowLeftPositions['left-center'] = '100%'
    this.arrowLeftPositions['left-top'] = '100%'
    this.arrowLeftPositions['left-bottom'] = '100%'

    this.arrowLeftPositions['right-top'] = -(ARROW_SIZE * 2)
    this.arrowLeftPositions['right-center'] = -(ARROW_SIZE * 2)
    this.arrowLeftPositions['right-bottom'] = -(ARROW_SIZE * 2)
  },

  calcTopPositionArrow ({ curHeight }) {
    this.arrowTopPositions['top-left'] = '100%'
    this.arrowTopPositions['top-center'] = '100%'
    this.arrowTopPositions['top-right'] = '100%'

    const positionRootCenter = (curHeight / 2) - ARROW_SIZE
    this.arrowTopPositions['left-center'] = positionRootCenter
    this.arrowTopPositions['right-center'] = positionRootCenter

    this.arrowTopPositions['bottom-left'] = -(ARROW_SIZE * 2)
    this.arrowTopPositions['bottom-center'] = -(ARROW_SIZE * 2)
    this.arrowTopPositions['bottom-right'] = -(ARROW_SIZE * 2)

    this.arrowTopPositions['left-top'] = 10
    this.arrowTopPositions['right-top'] = 10

    this.arrowTopPositions['left-bottom'] = curHeight - (ARROW_SIZE * 2) - 10
    this.arrowTopPositions['right-bottom'] = curHeight - (ARROW_SIZE * 2) - 10
  },

  // TODO: fix - Maximum call stack size exceeded
  getValidPlacement ({
    placement,
    curHeight,
    curWidth
  }) {
    const activeIndexPlacement = this.placementOrder.findIndex(item => {
      return item === placement
    })

    let nextIndex = activeIndexPlacement + 1
    if (nextIndex > this.placementOrder.length - 1) nextIndex = 0

    if (this.leftPositions[placement] < 0 ||
        this.leftPositions[placement] + curWidth > Dimensions.get('window').width) {
      return this.getValidPlacement({
        placement: this.placementOrder[nextIndex],
        curHeight,
        curWidth
      })
    }

    const [rootPlacement] = placement.split('-')
    let _topPosition = this.topPositions[placement]
    if (rootPlacement === 'top') _topPosition -= curHeight

    if (_topPosition < 0 || _topPosition + curHeight > Dimensions.get('window').height) {
      return this.getValidPlacement({
        placement: this.placementOrder[nextIndex],
        curHeight,
        curWidth
      })
    }

    return this.placementOrder[activeIndexPlacement]
  }

}
