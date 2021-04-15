import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet
} from 'react-native'
import { observer, useValue } from 'startupjs'
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

function isStampInit (step) {
  return ['close', 'render'].indexOf(step) === -1
}

function getValidNode (current) {
  return current.measure
    ? current
    : current.getNode()
}

function Popover ({
  children,
  style,
  arrowStyle,
  wrapperContentStyle,
  renderContent,
  visible,
  $visible,
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

  const [_visible, _$visible] = useValue(false)
  const [step, $step] = useValue(STEPS.CLOSE)
  const [validPlacement, setValidPlacement] = useState(position + '-' + attachment)
  const [dimensions, $dimensions] = useValue({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  })

  const [animateStates] = useState({
    opacity: new Animated.Value(0),
    scaleX: new Animated.Value(1),
    scaleY: new Animated.Value(1),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0)
  })

  useLayoutEffect(() => {
    if (!$visible) return
    _$visible.ref($visible)
    return () => _$visible.removeRef()
  }, [])

  useEffect(() => {
    if (visible === undefined) return
    _$visible.set(visible)
  }, [visible])

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
      onDismiss && onDismiss(false)
    }

    Dimensions.addEventListener('change', handleDimensions)
    return () => {
      mounted = false
      Dimensions.removeEventListener('change', handleDimensions)
    }
  }, [])

  // -main
  useEffect(() => {
    if (step === STEPS.CLOSE && _visible) {
      $step.set(STEPS.RENDER)
      setTimeout(runShow, 0)
    }

    if (step !== STEPS.CLOSE && !_visible) {
      runHide()
    }
  }, [_visible])
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

        animate.show({
          durationOpen,
          geometry: refGeometry.current,
          contentInfo,
          animateType,
          animateStates,
          hasArrow
        }, () => {
          $step.set(STEPS.OPEN)
          onRequestOpen && onRequestOpen()
        })
      })
    })
  }

  function _closeStep () {
    $step.set(STEPS.CLOSE)
    onDismiss && onDismiss(false)
    onRequestClose && onRequestClose()
  }

  function _onDismiss () {
    if ($visible === undefined && visible === undefined) {
      _$visible.set(false)
    }
    onDismiss && onDismiss(false)
  }

  function runHide () {
    if (!refPopover.current) {
      _closeStep()
    } else {
      getValidNode(refPopover.current).measure((x, y, popoverWidth, popoverHeight) => {
        const contentInfo = { width: popoverWidth, height: popoverHeight }
        $step.set(STEPS.ANIMATE)

        animate.hide({
          durationClose,
          geometry: refGeometry.current,
          animateType,
          contentInfo,
          animateStates,
          hasArrow
        }, _closeStep)
      })
    }
  }

  React.Children.only(children)

  // set caption
  let caption = null
  if (visible === undefined && $visible === undefined) {
    caption = pug`
      TouchableOpacity(
        style=style
        ref=refCaption
        onPress=()=> _$visible.set(true)
      )= children
    `
  } else {
    caption = pug`
      View(
        style=style
        ref=refCaption
      )= children
    `
  }

  // set need coordinates for the position
  // on the screen from refGeometry
  const _coordsStyle = StyleSheet.flatten([
    STYLES.coords,
    {
      left: refGeometry.current.positionLeft,
      top: refGeometry.current.positionTop
    }
  ])

  // if geometric data is received, play animation from animateStates
  // otherwise use stamp styles to hide the element before counting
  const _popoverStyle = StyleSheet.flatten([
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
      : STYLES.stamp
  ])

  // TODO comment
  const [validPosition] = validPlacement.split('-')
  if (isStampInit(step) && validPosition === 'top') _popoverStyle.bottom = 0
  if (isStampInit(step) && validPosition === 'left') _popoverStyle.right = 0
  if (isStampInit(step) && validPlacement === 'left-end') _popoverStyle.bottom = 0
  if (isStampInit(step) && validPlacement === 'right-end') _popoverStyle.bottom = 0

  // HACK: stretch the content block
  // needed for android, there it is impossible to display a child that goes beyond the size of the parent,
  // you have to give the parent the maximum possible width, depending on the validPosition
  if (validPosition !== 'left') {
    _coordsStyle.width = '100%'
    _coordsStyle.maxWidth = Dimensions.get('window').width - (_coordsStyle.left || 0)
  } else {
    _coordsStyle.width = _coordsStyle.left
    _coordsStyle.left = 0
  }

  // set popover content from caption width, if hasWidthCaption prop is true
  if (hasWidthCaption && captionInfo.current) {
    _popoverStyle.width = captionInfo.current.width
  }

  // common overlay
  return pug`
    = caption

    Portal
      if step !== STEPS.CLOSE
        if hasOverlay
          TouchableWithoutFeedback(onPress=_onDismiss)
            View.overlay

        View(style=_coordsStyle)
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
            = renderContent()
  `
}

const ObservedPopover = observer(Popover, { forwardRef: true })

ObservedPopover.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  animateType: 'opacity',
  hasWidthCaption: false,
  hasArrow: false,
  hasOverlay: true,
  hasDefaultWrapper: true,
  durationOpen: 150,
  durationClose: 100
}

ObservedPopover.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderContent: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  $visible: PropTypes.object,
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

export default ObservedPopover
