import React, { useState, useEffect, useRef } from 'react'
import {
  SafeAreaView,
  Animated,
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import Modal from '../../Modal'
import Swipe from './Swipe'
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

const SHTAMP_RENDER_STYLE = {
  left: -999,
  top: -999,
  position: 'absolute',
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

// TODO: more test for work responder with ScrollView
// https://material-ui.com/ru/components/drawers/#%D1%81%D1%82%D0%BE%D0%B9%D0%BA%D0%B0%D1%8F-%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C
function Drawer ({
  style,
  swipeStyle,
  caseStyle,
  children,
  visible,
  position,
  isSwipe,
  isShowOverlay,
  hasDefaultStyleContent,
  onDismiss,
  onRequestOpen
}) {
  const isHorizontal = position === 'left' || position === 'right'
  const isInvertPosition = position === 'left' || position === 'top'

  const refContent = useRef()
  const [contentSize, setContentSize] = useState({ width: null, height: null })
  const [, $isRender] = useValue(true)

  const [animateOpacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [animatePosition] = useState(new Animated.Value(0))

  useEffect(() => {
    if (contentSize.width === null) setParams()

    if (visible) show()
    else hide()
  }, [visible])

  const setParams = () => {
    if (contentSize.width !== null) return

    setTimeout(() => {
      if (!refContent.current || !refContent.current.getNode || !refContent.current.getNode()) {
        return
      }

      refContent.current.getNode().measure((x, y, width, height) => {
        setContentSize({ height, width })

        if (!visible) {
          animatePosition.setValue(
            isHorizontal
              ? isInvertPosition ? -width : width
              : isInvertPosition ? -height : height
          )
        }

        $isRender.set(visible)
      })
    }, 0)
  }

  const show = () => {
    $isRender.set(true)

    const animated = () => {
      Animated.parallel([
        Animated.timing(animatePosition, { toValue: 0, duration: 300 }),
        isShowOverlay && Animated.timing(animateOpacity, { toValue: 1, duration: 300 })
      ]).start(() => {
        onRequestOpen && onRequestOpen()
      })
    }

    if (Platform.OS === 'android') {
      setTimeout(() => animated(), 0)
    } else {
      animated()
    }
  }

  const hide = () => {
    Animated.parallel([
      Animated.timing(animatePosition, {
        toValue:
            isHorizontal
              ? isInvertPosition ? -contentSize.width : contentSize.width
              : isInvertPosition ? -contentSize.height : contentSize.height,
        duration: 200
      }),
      isShowOverlay && Animated.timing(animateOpacity, { toValue: 0, duration: 200 })
    ]).start(() => {
      $isRender.set(false)
      onDismiss()
    })
  }

  const isSizeDefined = (contentSize.width || (!contentSize.width && visible))
  const _styleCase = StyleSheet.flatten([
    POSITION_STYLES[position],
    caseStyle,
    { opacity: contentSize.width ? 1 : 0 }
  ])

  const _styleContent = StyleSheet.flatten([
    { transform: [{ [POSITION_NAMES[position]]: animatePosition }] },
    style
  ])

  const Wrapper = isSizeDefined ? Modal : View
  return pug`
    Wrapper(
      transparent=true
      ariaHideApp=false
      $visible=$isRender
      variant='custom'
      style=isSizeDefined ? {} : SHTAMP_RENDER_STYLE
    )
      SafeAreaView.areaCase
        View.case(style=_styleCase)
          if isShowOverlay
            TouchableWithoutFeedback(onPress=onDismiss style={ cursor: 'default' })
              Animated.View.overlay(style={ opacity: animateOpacity })
          Animated.View(
            ref=refContent
            styleName={
              content: hasDefaultStyleContent,
              contentBottom: hasDefaultStyleContent && position === 'bottom',
              fullHorizontal: hasDefaultStyleContent && isHorizontal,
              fullVertical: hasDefaultStyleContent && !isHorizontal
            }
            style=_styleContent
          )
            Swipe(
              position=position
              contentSize=contentSize
              swipeStyle=swipeStyle
              isHorizontal=isHorizontal
              isSwipe=isSwipe
              isInvertPosition=isInvertPosition
              animatePosition=animatePosition
              hide=hide
              show=show
            )
            = children
  `
}

Drawer.defaultProps = {
  visible: false,
  position: 'left',
  isSwipe: true,
  isShowOverlay: true,
  hasDefaultStyleContent: true
}

Drawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  isSwipe: PropTypes.bool,
  isShowOverlay: PropTypes.bool,
  hasDefaultStyleContent: PropTypes.bool,
  styleCase: PropTypes.object,
  styleContent: PropTypes.object
}

export default observer(Drawer)
