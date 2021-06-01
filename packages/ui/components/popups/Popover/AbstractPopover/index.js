import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  View,
  Animated,
  Dimensions,
  StyleSheet
} from 'react-native'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import Arrow from '../Arrow'
import Portal from '../../../Portal'
import Geometry from '../Geometry'
import { PLACEMENTS_ORDER, STEPS } from '../constants.json'
import animate from '../animate'
import STYLES from './index.styl'

function isMeasured (step) {
  return step !== 'close' && step !== 'measure'
}

function AbstractPopover ({
  children,
  style,
  arrowStyle,
  refCaption,
  visible,
  position,
  attachment,
  placements,
  animateType,
  durationOpen,
  durationClose,
  arrow,
  hasWidthCaption,
  renderWrapper,
  onRequestOpen,
  onRequestClose
}, ref) {
  style = StyleSheet.flatten([style])

  const refPopover = useRef()
  const refGeometry = useRef({})
  const captionInfo = useRef({})

  const [step, $step] = useValue(STEPS.CLOSE)
  const [validPlacement, setValidPlacement] = useState(position + '-' + attachment)
  const [dimensions, $dimensions] = useValue({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  })

  const [animateStates] = useState({
    opacity: new Animated.Value(0),
    height: new Animated.Value(0),
    width: new Animated.Value(0),
    scaleX: new Animated.Value(1),
    scaleY: new Animated.Value(1),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0)
  })

  // reset state after change dimensions
  useLayoutEffect(() => {
    let mounted = true

    const handleDimensions = () => {
      if (!mounted) return
      $dimensions.setDiff({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
      })
      _closeStep()
    }

    Dimensions.addEventListener('change', handleDimensions)
    return () => {
      mounted = false
      Dimensions.removeEventListener('change', handleDimensions)
    }
  }, [])

  // -main
  useEffect(() => {
    if (step === STEPS.CLOSE && visible) {
      $step.set(STEPS.MEASURE)
      setTimeout(runShow, 0)
    }

    if (step !== STEPS.CLOSE && !visible) {
      runHide()
    }
  }, [visible])
  // -

  function runShow () {
    if (!refCaption.current) return

    refCaption.current.measure((captionX, captionY, captionWidth, captionHeight, captionPageX, captionPageY) => {
      if (!refPopover.current) return

      refPopover.current.measure((popoverX, popoverY, popoverWidth, popoverHeight, popoverPageX, popoverPageY) => {
        captionInfo.current = {
          x: captionPageX,
          y: captionPageY,
          width: captionWidth,
          height: captionHeight
        }

        const { height = 'auto', maxHeight } = style
        let curHeight = (height === 'auto') ? popoverHeight : height
        curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

        let curWidth = hasWidthCaption ? captionWidth : popoverWidth
        const contentInfo = {
          x: captionPageX,
          y: captionPageY,
          height: curHeight,
          width: curWidth
        }

        refGeometry.current = new Geometry({
          placement: position + '-' + attachment,
          captionInfo: captionInfo.current,
          contentInfo,
          placements,
          dimensions,
          arrow
        })

        setValidPlacement(refGeometry.current.validPlacement)
        $step.set(STEPS.RENDER)

        animate.show({
          durationOpen,
          geometry: refGeometry.current,
          contentInfo,
          animateType,
          animateStates,
          arrow
        }, () => {
          $step.set(STEPS.OPEN)
          onRequestOpen && onRequestOpen()
        })
      })
    })
  }

  function runHide () {
    if (!refPopover.current) {
      _closeStep()
    } else {
      refPopover.current.measure((popoverX, popoverY, popoverWidth, popoverHeight) => {
        const contentInfo = { width: popoverWidth, height: popoverHeight }
        $step.set(STEPS.RENDER)

        animate.hide({
          durationClose,
          geometry: refGeometry.current,
          animateType,
          contentInfo,
          animateStates,
          arrow
        }, _closeStep)
      })
    }
  }

  function _closeStep () {
    $step.set(STEPS.CLOSE)
    onRequestClose && onRequestClose()
  }

  // styles
  const positionStyle = StyleSheet.flatten([
    STYLES.location,
    {
      left: refGeometry.current.positionLeft,
      top: refGeometry.current.positionTop
    }
  ])

  const animateStyle = StyleSheet.flatten([
    isMeasured(step)
      ? {
        ...STYLES.animate,
        opacity: animateStates.opacity,
        transform: [
          { scaleX: animateStates.scaleX },
          { scaleY: animateStates.scaleY },
          { translateX: animateStates.translateX },
          { translateY: animateStates.translateY }
        ]
      }
      : STYLES.stamp
  ])

  // We make it possible to correctly expand the geometry of the component when changing its content, in all sides
  const [validPosition] = validPlacement.split('-')
  if (isMeasured(step) && validPosition === 'top') animateStyle.bottom = 0
  if (isMeasured(step) && validPosition === 'left') animateStyle.right = 0
  if (isMeasured(step) && validPlacement === 'left-end') animateStyle.bottom = 0
  if (isMeasured(step) && validPlacement === 'right-end') animateStyle.bottom = 0

  if (validPosition !== 'left') {
    positionStyle.width = '100%'
    positionStyle.maxWidth = Dimensions.get('window').width - (positionStyle.left || 0)
  } else {
    positionStyle.width = positionStyle.left
    positionStyle.left = 0
  }

  if (hasWidthCaption && captionInfo.current) {
    animateStyle.width = captionInfo.current.width
  }

  const popover = pug`
    View(style=positionStyle)
      Animated.View(
        ref=refPopover
        style=[style, animateStyle]
      )
        if arrow
          Arrow(
            style=arrowStyle
            geometry=refGeometry.current
            validPosition=validPosition
          )
        = children
  `

  return pug`
    Portal
      if step !== STEPS.CLOSE
        = renderWrapper(popover)
  `
}

const ObservedAP = observer(AbstractPopover, { forwardRef: true })

ObservedAP.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  animateType: 'opacity',
  hasWidthCaption: false,
  arrow: false,
  durationOpen: 300,
  durationClose: 300
}

ObservedAP.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  animateType: PropTypes.oneOf(['opacity', 'scale']),
  hasWidthCaption: PropTypes.bool,
  arrow: PropTypes.bool,
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number,
  onRequestOpen: PropTypes.func,
  onRequestClose: PropTypes.func
}

export default ObservedAP
