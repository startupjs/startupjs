import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  ScrollView
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Arrow from './Arrow'
import Portal from '../../Portal'
import Geometry from './Geometry'
import { PLACEMENTS_ORDER } from './constants.json'
import animate from './animate'
import STYLES from './index.styl'

const STEPS = {
  CLOSE: 'close',
  RENDER: 'render',
  ANIMATE: 'animate',
  OPEN: 'open'
}

function isShtampInit (step) {
  return ['close', 'render'].indexOf(step) === -1
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

  const [step, setStep] = useState(STEPS.CLOSE)
  const [validPlacement, setValidPlacement] = useState(position + '-' + attachment)
  const [captionInfo, setCaptionInfo] = useState({})

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
      setStep(STEPS.CLOSE)
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
      setStep(STEPS.RENDER)
      setTimeout(runShow, 0)
    }

    if (step !== STEPS.CLOSE && !visible) {
      runHide()
    }
  }, [visible])
  // -

  function runShow () {
    if (!refCaption.current || !refPopover.current) return

    // x, y, width, height, pageX, pageY
    refCaption.current.measure((cx, cy, cWidth, cHeight, cpx, cpy) => {
      refPopover.current.measure((px, py, pWidth, pHeight, ppx, ppy) => {
        const captionInfo = { x: cpx, y: cpy, width: cWidth, height: cHeight }

        const { width, height = 'auto', maxHeight } = style
        let curHeight = (height === 'auto') ? pHeight : height
        curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

        let curWidth = width || pWidth
        curWidth = hasWidthCaption ? captionInfo.width : curWidth
        const contentInfo = {
          x: cpx,
          y: cpy,
          height: curHeight,
          width: curWidth
        }

        refGeometry.current = new Geometry({
          placement: position + '-' + attachment,
          captionInfo,
          contentInfo,
          placements,
          hasArrow
        })

        setValidPlacement(refGeometry.current.validPlacement)
        setStep(STEPS.ANIMATE)

        animate.show({
          durationOpen,
          geometry: refGeometry.current,
          contentInfo,
          animateType,
          animateStates,
          hasArrow
        }, () => {
          setStep(STEPS.OPEN)
          onRequestOpen && onRequestOpen()
        })
      })
    })
  }

  function runHide () {
    if (!refPopover.current) return

    refPopover.current.measure((x, y, popoverWidth, popoverHeight) => {
      const contentInfo = { width: popoverWidth, height: popoverHeight }
      setStep(STEPS.ANIMATE)

      animate.hide({
        durationClose,
        geometry: refGeometry.current,
        animateType,
        contentInfo,
        animateStates,
        hasArrow
      }, () => {
        setStep(STEPS.CLOSE)
        onDismiss && onDismiss()
        onRequestClose && onRequestClose()
      })
    })
  }

  // parse children
  let caption = null
  let content = []
  const onLayoutCaption = e => {
    setCaptionInfo(e.nativeEvent.layout)
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
    isShtampInit(step)
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
      : STYLES.popoverShtamp
  ])

  const [validPosition] = validPlacement.split('-')
  if (isShtampInit(step) && validPosition === 'top') _popoverStyle.bottom = 0
  if (isShtampInit(step) && validPosition === 'left') _popoverStyle.right = 0
  if (isShtampInit(step) && validPlacement === 'left-end') _popoverStyle.bottom = 0
  if (isShtampInit(step) && validPlacement === 'right-end') _popoverStyle.bottom = 0

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
  if (hasWidthCaption) {
    _popoverStyle.width = captionInfo.width
  }

  return pug`
    = caption
    Portal
      if step !== STEPS.CLOSE
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
                style=STYLES.hasArrow
                showsVerticalScrollIndicator=step !== STEPS.ANIMATE
              )= content
            else
              = content
  `
}

function PopoverCaption ({ children }) {
  return children
}

const ObservedPopover = observer(Popover, { forwardRef: true })

ObservedPopover.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  animateType: 'default',
  hasWidthCaption: false,
  hasArrow: false,
  hasOverlay: true,
  hasDefaultWrapper: true,
  durationOpen: 300,
  durationClose: 200
}

ObservedPopover.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  animateType: PropTypes.oneOf(['default', 'slide', 'scale']),
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

ObservedPopover.Caption = PopoverCaption
export default ObservedPopover
