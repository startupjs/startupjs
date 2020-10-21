import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  SafeAreaView,
  Animated,
  View,
  TouchableWithoutFeedback,
  Platform,
  Dimensions
} from 'react-native'
import Modal from '../../Modal'
import Swipe from './Swipe'
import { observer } from 'startupjs'
import STYLES from './index.styl'

const { shadows } = STYLES

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
  visible,
  position,
  onDismiss,
  isSwipe,
  isShowOverlay,
  hasDefaultStyleContent,
  styleSwipe,
  styleContent,
  styleCase,
  children
}) {
  const isHorizontal = position === 'left' || position === 'right'
  const isInvertPosition = position === 'left' || position === 'top'

  const refContent = useRef()
  const [contentSize, setContentSize] = useState({ width: null, height: null })
  const [isRender, setIsRender] = useState(true)

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

        setIsRender(visible)
      })
    }, 0)
  }

  const show = callback => {
    setIsRender(true)

    const animated = () => {
      Animated.parallel([
        Animated.timing(animatePosition, { toValue: 0, duration: 300 }),
        isShowOverlay && Animated.timing(animateOpacity, { toValue: 1, duration: 300 })
      ]).start(() => {
        callback && callback()
      })
    }

    if (Platform.OS === 'android') {
      setTimeout(() => animated(), 0)
    } else {
      animated()
    }
  }

  const hide = callback => {
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
      setIsRender(false)
      onDismiss()
      callback && callback()
    })
  }

  const isSizeDefined = ((contentSize.width) || (!contentSize.width && visible))
  const Wrapper = isSizeDefined ? Modal : View
  const _styleCase = {
    ...POSITION_STYLES[position],
    ...styleCase,
    opacity: contentSize.width ? 1 : 0
  }
  const _styleContent = {
    transform: [{ [POSITION_NAMES[position]]: animatePosition }],
    ...shadows[2],
    ...styleContent
  }

  return pug`
    Wrapper(
      transparent=true
      ariaHideApp=false
      visible=isRender
      variant='pure'
      style=isSizeDefined ? {} : SHTAMP_RENDER_STYLE
    )
      SafeAreaView.areaCase
        View.case(style=_styleCase)
          if isShowOverlay
            TouchableWithoutFeedback(onPress=onDismiss style={ cursor: 'default' })
              Animated.View.overlay(style={ opacity: animateOpacity })
          Animated.View.s(
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
              styleSwipe=styleSwipe
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
