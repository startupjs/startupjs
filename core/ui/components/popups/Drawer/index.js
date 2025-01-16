import React, { useState, useEffect, useRef } from 'react'
import {
  SafeAreaView,
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Portal from '../../Portal'
import Swipe from './Swipe'
import animate from './animate'
import './index.styl'

const POSITION_STYLES = {
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  top: { justifyContent: 'flex-start' },
  bottom: { justifyContent: 'flex-end' }
}

const POSITION_NAMES = {
  left: 'translateX',
  right: 'translateX',
  top: 'translateY',
  bottom: 'translateY'
}

// TODO: more test for work responder with ScrollView
// https://material-ui.com/ru/components/drawers/#%D1%81%D1%82%D0%BE%D0%B9%D0%BA%D0%B0%D1%8F-%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C
function Drawer ({
  style,
  AreaComponent = SafeAreaView,
  ContentComponent = View,
  swipeStyle,
  children,
  visible,
  position,
  isSwipe,
  hasOverlay,
  showResponder,
  onDismiss,
  onRequestOpen
}) {
  const isHorizontal = position === 'left' || position === 'right'
  const isInvertPosition = position === 'left' || position === 'top'

  const refContent = useRef()
  const [isShow, setIsShow] = useState(false)
  const [contentSize, setContentSize] = useState({})

  const [animateStates] = useState({
    opacity: new Animated.Value(visible ? 1 : 0),
    position: new Animated.Value(0)
  })

  // -main
  useEffect(() => {
    if (visible) {
      setIsShow(true)
      setTimeout(runShow, 0)
    } else {
      runHide()
    }
  }, [visible])
  // -

  async function waitForDrawerRef () {
    let attempts = 0

    while (attempts < 5) {
      if (refContent.current) return true
      await new Promise(resolve => setTimeout(resolve, 30))
      attempts++
    }

    return !!refContent.current
  }

  async function runShow () {
    await waitForDrawerRef()

    getValidNode(refContent.current).measure((x, y, width, height) => {
      const isInit = !contentSize.width
      setContentSize({ width, height })

      animate.show({
        width,
        height,
        contentSize,
        animateStates,
        hasOverlay,
        isHorizontal,
        isInvertPosition,
        isInit
      }, () => {
        onRequestOpen && onRequestOpen()
      })
    })
  }

  async function runHide () {
    if (!refContent.current) return

    getValidNode(refContent.current).measure((x, y, width, height) => {
      animate.hide({
        width,
        height,
        animateStates,
        hasOverlay,
        isHorizontal,
        isInvertPosition
      }, () => {
        setContentSize({})
        setIsShow(false)
        onDismiss()
      })
    })
  }

  const _styleCase = StyleSheet.flatten([
    POSITION_STYLES[position],
    { opacity: isShow ? 1 : 0 }
  ])

  const _styleContent = StyleSheet.flatten([
    { transform: [{ [POSITION_NAMES[position]]: animateStates.position }] },
    style
  ])

  return pug`
    if isShow
      Portal
        AreaComponent.area
          ContentComponent.case(style=_styleCase)
            if hasOverlay
              TouchableWithoutFeedback.overlayCase(onPress=onDismiss)
                Animated.View.overlay(style={ opacity: animateStates.opacity })

            Animated.View(
              ref=refContent
              styleName={
                contentDefault: isShow,
                contentBottom: isShow && position === 'bottom',
                fullHorizontal: isShow && isHorizontal,
                fullVertical: isShow && !isHorizontal
              }
              style=_styleContent
            )
              if showResponder
                Swipe(
                  position=position
                  contentSize=contentSize
                  swipeStyle=swipeStyle
                  isHorizontal=isHorizontal
                  isSwipe=isSwipe
                  isInvertPosition=isInvertPosition
                  animateStates=animateStates
                  runHide=runHide
                  runShow=runShow
                )
              = children
  `
}

function getValidNode (current) {
  return current.measure
    ? current
    : current.getNode()
}

Drawer.defaultProps = {
  visible: false,
  position: 'left',
  isSwipe: true,
  hasOverlay: true,
  showResponder: true
}

Drawer.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  swipeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  isSwipe: PropTypes.bool,
  hasOverlay: PropTypes.bool,
  showResponder: PropTypes.bool,
  onDismiss: PropTypes.func,
  onRequestOpen: PropTypes.func
}

export default observer(Drawer)
