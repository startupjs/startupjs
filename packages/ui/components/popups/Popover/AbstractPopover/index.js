import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import Arrow from '../Arrow'
import Portal from '../../../Portal'
import getGeometry from './getGeometry'
import { PLACEMENTS_ORDER } from '../constants.json'
import animate from '../animate'
import STYLES from './index.styl'

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
  matchCaptionWidth,
  renderWrapper,
  onRequestOpen,
  onRequestClose
}) {
  style = StyleSheet.flatten([style])

  const refAnimate = useRef()
  const [contentInfo, setContentInfo] = useState({})
  const [isRender, setIsRender] = useState(false)
  const [geometry, setGeometry] = useState(null)

  const [animateStates] = useState({
    opacity: new Animated.Value(0),
    height: new Animated.Value(0),
    width: new Animated.Value(0),
    scaleX: new Animated.Value(1),
    scaleY: new Animated.Value(1),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0)
  })

  // -dimensions
  const [dimensions, $dimensions] = useValue({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  })
  useLayoutEffect(() => {
    let mounted = true

    function handleDimensions () {
      if (!mounted) return
      $dimensions.setDiff({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
      })
      resetStates()
    }

    Dimensions.addEventListener('change', handleDimensions)
    return () => {
      mounted = false
      Dimensions.removeEventListener('change', handleDimensions)
    }
  }, [])
  // -

  // -main
  useEffect(() => {
    if (refAnimate.current) {
      refAnimate.current.stop()
      refAnimate.current = null
    }

    if (visible) {
      setIsRender(true)
    }

    if (!visible && isRender) {
      refAnimate.current = animate.hide({
        geometry,
        contentInfo,
        durationClose,
        animateType,
        animateStates
      })
      refAnimate.current.start(({ finished }) => {
        refAnimate.current = null
        finished && resetStates()
      })
    }
  }, [visible])
  // -

  function onLayout ({ nativeEvent }) {
    const contentWidth = nativeEvent.layout.width || contentInfo.width
    const contentHeight = nativeEvent.layout.height || contentInfo.height

    refCaption.current.measure((captionX, captionY, captionWidth, captionHeight, captionPageX, captionPageY) => {
      if (refAnimate.current) return

      // captionInfo
      const captionInfo = {
        x: captionPageX,
        y: captionPageY,
        width: captionWidth,
        height: captionHeight
      }

      // contentInfo
      const { height = 'auto', maxHeight } = style
      let curHeight = (height === 'auto') ? contentHeight : height
      curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

      let curWidth = matchCaptionWidth ? captionWidth : contentWidth
      const contentInfo = { height: curHeight, width: curWidth }
      setContentInfo({ ...contentInfo })

      // geometry
      const _geometry = getGeometry({
        placement: position + '-' + attachment,
        placements,
        captionInfo,
        contentInfo,
        dimensions,
        arrow
      })
      setGeometry(_geometry)

      // animate
      refAnimate.current = animate.show({
        geometry: _geometry,
        contentInfo,
        durationOpen,
        animateType,
        animateStates
      })
      refAnimate.current.start(({ finished }) => {
        refAnimate.current = null
        finished && onRequestOpen && onRequestOpen()
      })
    })
  }

  function resetStates () {
    setIsRender(false)
    setGeometry(null)
    onRequestClose && onRequestClose()
  }

  // styles
  const positionStyle = StyleSheet.flatten([
    STYLES.position,
    {
      left: geometry ? geometry.positionLeft : 0,
      top: geometry ? geometry.positionTop : 0
    }
  ])

  const animateStyle = StyleSheet.flatten([
    geometry
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
      : STYLES.stub
  ])

  if (matchCaptionWidth && geometry) {
    animateStyle.width = geometry.captionInfo.width
  }

  const popover = pug`
    Animated.View(
      onLayout=onLayout
      style=[style, positionStyle, animateStyle]
    )
      if arrow
        Arrow(
          style=arrowStyle
          geometry=geometry
        )
      = children
  `

  return pug`
    Portal
      if isRender
        = renderWrapper(popover)
  `
}

const ObservedAP = observer(AbstractPopover)

ObservedAP.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  animateType: 'opacity',
  matchCaptionWidth: false,
  arrow: false,
  durationOpen: 300,
  durationClose: 300,
  renderWrapper: children => children
}

ObservedAP.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  animateType: PropTypes.oneOf(['opacity', 'scale']),
  matchCaptionWidth: PropTypes.bool,
  arrow: PropTypes.bool,
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number,
  onRequestOpen: PropTypes.func,
  onRequestClose: PropTypes.func
}

export default ObservedAP
