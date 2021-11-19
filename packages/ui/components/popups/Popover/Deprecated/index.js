import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  ScrollView
} from 'react-native'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import Arrow from './Arrow'
import Portal from '../../../Portal'
import Geometry from './Geometry'
import CONSTANTS from '../constants.json'
import animate from '../animate'
import themed from '../../../../theming/themed'
import STYLES from './index.styl'

const { PLACEMENTS_ORDER } = CONSTANTS

const STEPS = {
  CLOSE: 'close',
  RENDER: 'render',
  ANIMATE: 'animate',
  OPEN: 'open'
}

function isStampInit (step) {
  return ['close', 'render'].indexOf(step) === -1
}

function getValidNode (current) {
  return current.measure
    ? current
    : current.getNode()
}

// TODO: autofix placement for ref
function Popover ({
  children,
  style,
  arrowStyle,
  captionStyle,
  visible,
  position,
  attachment,
  placements,
  animateType,
  durationOpen,
  durationClose,
  hasArrow,
  hasWidthCaption,
  hasOverlay,
  hasDefaultWrapper,
  onDismiss,
  onRequestOpen,
  onRequestClose
}, ref) {
  style = StyleSheet.flatten([style])
  const refPopover = useRef()
  const refCaption = useRef()
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
      $step.set(STEPS.CLOSE)
      $dimensions.setDiff({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
      })
      onDismiss()
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
      $step.set(STEPS.RENDER)
      setTimeout(runShow, 0)
    }

    if (step !== STEPS.CLOSE && !visible) {
      runHide()
    }
  }, [visible])
  // -

  function runShow () {
    if (!refCaption.current) return
    // x, y, width, height, pageX, pageY
    getValidNode(refCaption.current).measure((cx, cy, cWidth, cHeight, cpx, cpy) => {
      if (!refPopover.current) return
      getValidNode(refPopover.current).measure((px, py, pWidth, pHeight, ppx, ppy) => {
        const _captionInfo = { x: cpx, y: cpy, width: cWidth, height: cHeight }

        const { width, height = 'auto', maxHeight } = style
        let curHeight = (height === 'auto') ? pHeight : height
        curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

        let curWidth = width || pWidth
        curWidth = hasWidthCaption ? _captionInfo.width : curWidth
        const contentInfo = {
          x: cpx,
          y: cpy,
          height: curHeight,
          width: curWidth
        }

        refGeometry.current = new Geometry({
          placement: position + '-' + attachment,
          captionInfo: _captionInfo,
          contentInfo,
          placements,
          hasArrow,
          dimensions
        })

        setValidPlacement(refGeometry.current.validPlacement)
        $step.set(STEPS.ANIMATE)

        const _animate = animate.show({
          durationOpen,
          geometry: refGeometry.current,
          contentInfo,
          animateType,
          animateStates,
          hasArrow
        })
        _animate.start(() => {
          $step.set(STEPS.OPEN)
          onRequestOpen && onRequestOpen()
        })
      })
    })
  }

  function _closeStep () {
    $step.set(STEPS.CLOSE)
    onDismiss && onDismiss()
    onRequestClose && onRequestClose()
  }

  function runHide () {
    if (!refPopover.current) {
      _closeStep()
    } else {
      getValidNode(refPopover.current).measure((x, y, popoverWidth, popoverHeight) => {
        const contentInfo = { width: popoverWidth, height: popoverHeight }
        $step.set(STEPS.ANIMATE)

        const _animate = animate.hide({
          durationClose,
          geometry: refGeometry.current,
          animateType,
          contentInfo,
          animateStates,
          hasArrow
        })
        _animate.start(_closeStep)
      })
    }
  }

  // parse children
  let caption = null
  let content = []
  const onLayoutCaption = e => {
    captionInfo.current = e.nativeEvent.layout
  }
  React.Children.toArray(children).forEach(child => {
    if (child.type.name === PopoverCaption.name) {
      caption = pug`
        View(
          ref=refCaption
          style=[captionStyle, child.props.style]
          onLayout=onLayoutCaption
        )= child.props.children
      `
    } else {
      content.push(child)
    }
  })

  // styles
  const _wrapperStyle = StyleSheet.flatten([
    STYLES.wrapper,
    {
      left: refGeometry.current.positionLeft,
      top: refGeometry.current.positionTop
    }
  ])

  const _popoverStyle = StyleSheet.flatten([
    style,
    isStampInit(step)
      ? {
        position: 'absolute',
        opacity: animateStates.opacity,
        transform: [
          { scaleX: animateStates.scaleX },
          { scaleY: animateStates.scaleY },
          { translateX: animateStates.translateX },
          { translateY: animateStates.translateY }
        ]
      }
      : STYLES.popoverStamp
  ])

  const [validPosition] = validPlacement.split('-')
  if (isStampInit(step) && validPosition === 'top') _popoverStyle.bottom = 0
  if (isStampInit(step) && validPosition === 'left') _popoverStyle.right = 0
  if (isStampInit(step) && validPlacement === 'left-end') _popoverStyle.bottom = 0
  if (isStampInit(step) && validPlacement === 'right-end') _popoverStyle.bottom = 0

  if (step === STEPS.ANIMATE && animateType === 'default') {
    delete _popoverStyle.minHeight
    _popoverStyle.height = animateStates.height
  }

  if (validPosition !== 'left') {
    _wrapperStyle.width = '100%'
    _wrapperStyle.maxWidth = Dimensions.get('window').width - (_wrapperStyle.left || 0)
  } else {
    _wrapperStyle.width = _wrapperStyle.left
    _wrapperStyle.left = 0
  }
  if (hasWidthCaption && captionInfo.current) {
    _popoverStyle.width = captionInfo.current.width
  }
  if (step === STEPS.ANIMATE) {
    _popoverStyle.width = animateStates.width
    _popoverStyle.height = animateStates.height
  }

  return pug`
    = caption
    if step !== STEPS.CLOSE
      Portal
        if hasOverlay
          TouchableWithoutFeedback(onPress=onDismiss)
            View.overlay
        View(style=_wrapperStyle)
          Animated.View.popover(
            ref=refPopover
            style=_popoverStyle
            styleName={ hasArrow }
          )
            if hasArrow
              Arrow(
                style=arrowStyle
                geometry=refGeometry.current
                validPosition=validPosition
              )
            if hasDefaultWrapper
              ScrollView.content(
                ref=ref
                styleName={ hasArrow }
                showsVerticalScrollIndicator=step !== STEPS.ANIMATE
              )= content
            else
              = content
  `
}

function PopoverCaption ({ children }) {
  return children
}

Popover.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  animateType: 'opacity',
  hasWidthCaption: false,
  hasArrow: false,
  hasOverlay: true,
  hasDefaultWrapper: true,
  durationOpen: 300,
  durationClose: 200
}

Popover.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  animateType: PropTypes.oneOf(['opacity', 'scale']),
  hasWidthCaption: PropTypes.bool,
  hasArrow: PropTypes.bool,
  hasOverlay: PropTypes.bool,
  hasInsideScroll: PropTypes.bool,
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number,
  onDismiss: PropTypes.func,
  onRequestOpen: PropTypes.func,
  onRequestClose: PropTypes.func
}

const ObservedPopover = observer(
  themed('Popover', Popover),
  { forwardRef: true }
)

ObservedPopover.Caption = PopoverCaption

export default ObservedPopover
