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
import STYLES from './index.styl'

const MARGIN = 16
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
  index,
  show,
  icon,
  text,
  title,
  actionLabel,
  onAction,
  onClose
}) {
  const [showAnimation] = useState(new Animated.Value(0))
  const [topAnimation] = useState(new Animated.Value(getTopPosition(index)))

  useEffect(() => {
    Animated.timing(topAnimation, {
      toValue: getTopPosition(index),
      duration: DURATION_OPEN
    }).start()
  }, [index])

  useEffect(() => {
    show ? onShow() : onHide()
  }, [show])

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
    Animated.View.animate(style={
      opacity: showAnimation,
      right: showAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-48, MARGIN]
      }),
      top: topAnimation
    })
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

        Div.textCase
          Span(numberOfLines=1)= text

        Row.actions
          Button(
            size='s'
            onPress=_onAction
          )= actionLabel || 'Close'
  `
})

function getTopPosition (index) {
  return (index * STYLES.item.height) + (MARGIN * (index + 1))
}
