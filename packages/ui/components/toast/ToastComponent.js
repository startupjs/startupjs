import React, { useEffect, useState } from 'react'
import { Animated } from 'react-native'
import { observer } from 'startupjs'
import { Div, Row, Span, Icon, Button } from '@startupjs/ui'
import {
  faExclamationCircle,
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import './index.styl'

const DURATION_OPEN = 300
const DURATION_CLOSE = 150

const ICONS = {
  info: faInfoCircle,
  error: faExclamationCircle,
  warning: faExclamationTriangle,
  success: faCheckCircle
}

const TITLES = {
  info: 'Info',
  error: 'Error',
  warning: 'Warning',
  success: 'Success'
}

export default observer(function ToastComponent ({
  alert = false,
  type = 'info',
  topPosition,
  height,
  show,
  icon,
  text,
  title,
  actionLabel,
  onAction,
  onClose,
  onLayout
}) {
  const [showAnimation] = useState(new Animated.Value(0))
  const [topAnimation] = useState(new Animated.Value(topPosition))

  useEffect(() => {
    Animated
      .timing(topAnimation, { toValue: topPosition, duration: DURATION_OPEN })
      .start()
  }, [topPosition])

  useEffect(() => {
    if (show && height) onShow()
    if (!show) onHide()
  }, [show, height])

  function onShow () {
    Animated
      .timing(showAnimation, { toValue: 1, duration: DURATION_OPEN })
      .start()
  }

  function onHide () {
    Animated
      .timing(showAnimation, { toValue: 0, duration: DURATION_CLOSE })
      .start(onClose)
  }

  function _onAction () {
    onAction && onAction()
    onHide()
  }

  return pug`
    Animated.View.root(
      style={
        opacity: showAnimation,
        right: showAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-48, 0]
        }),
        top: topAnimation
      }
      onLayout=e=> onLayout(e.nativeEvent.layout)
    )
      Div.item(styleName=[type])
        Row.header
          Row.titleCase
            Icon.icon(
              icon=icon ? icon : ICONS[type]
              styleName=[type]
            )
            Span.title(styleName=[type])
              = title ? title : TITLES[type]

          Div(onPress=onHide)
            Icon(icon=faTimes)

        Span.textCase= text

        Row.actions
          Button(
            size='s'
            onPress=_onAction
          )= actionLabel || 'Close'
  `
})
