import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import { useValue } from 'startupjs'
import { PLACEMENTS_ORDER } from './constants.json'
import Arrow from './Arrow'
import Geometry from './Geometry'
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

export default function usePopover ({
  style = [],
  arrowStyle = {},
  contentStyle = {},
  refAnimate = null,
  refCaption = null,
  visible = false,
  position = 'bottom',
  attachment = 'start',
  placements = PLACEMENTS_ORDER,
  animateType = 'opacity',
  durationOpen = 300,
  durationClose = 200,
  hasArrow = false,
  hasWidthCaption = false,
  onDismiss = null,
  onRequestOpen = null,
  onRequestClose = null,
  renderTooltip
}) {
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
      onDismiss && onDismiss()
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
      if (!refAnimate.current) return

      getValidNode(refAnimate.current).measure((ax, ay, aWidth, aHeight, apx, apy) => {
        captionInfo.current = { x: cpx, y: cpy, width: cWidth, height: cHeight }

        // TODO: test
        const { height = 'auto', maxHeight } = contentStyle
        let curHeight = (height === 'auto') ? aHeight : height
        curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

        let curWidth = hasWidthCaption ? captionInfo.current.width : aWidth
        const contentInfo = {
          x: cpx,
          y: cpy,
          height: curHeight,
          width: curWidth
        }

        refGeometry.current = new Geometry({
          placement: position + '-' + attachment,
          captionInfo: captionInfo.current,
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

  function runHide () {
    if (!refAnimate.current) {
      _closeStep()
    } else {
      getValidNode(refAnimate.current).measure((x, y, popoverWidth, popoverHeight) => {
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

  function _closeStep () {
    $step.set(STEPS.CLOSE)
    onDismiss && onDismiss()
    onRequestClose && onRequestClose()
  }

  // styles
  const locationStyle = StyleSheet.flatten([
    STYLES.location,
    {
      left: refGeometry.current.positionLeft,
      top: refGeometry.current.positionTop
    }
  ])

  const animateStyle = StyleSheet.flatten([
    isStampInit(step)
      ? {
        ...STYLES.animate,
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

  const [validPosition] = validPlacement.split('-')
  if (isStampInit(step) && validPosition === 'top') animateStyle.bottom = 0
  if (isStampInit(step) && validPosition === 'left') animateStyle.right = 0
  if (isStampInit(step) && validPlacement === 'left-end') animateStyle.bottom = 0
  if (isStampInit(step) && validPlacement === 'right-end') animateStyle.bottom = 0

  if (validPosition !== 'left') {
    locationStyle.width = '100%'
    locationStyle.maxWidth = Dimensions.get('window').width - (locationStyle.left || 0)
  } else {
    locationStyle.width = locationStyle.left
    locationStyle.left = 0
  }

  if (hasWidthCaption && captionInfo.current) {
    animateStyle.width = captionInfo.current.width
  }

  const arrow = pug`
    if hasArrow
      Arrow(
        style=arrowStyle
        geometry=refGeometry.current
        validPosition=validPosition
      )
  `

  return {
    refAnimate,
    step,
    locationStyle,
    animateStyle,
    arrow
  }
}
