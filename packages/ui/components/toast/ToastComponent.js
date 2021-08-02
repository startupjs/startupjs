import React, { useEffect, useRef, useState } from 'react'
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
  closeLabel,
  actionLabel,
  onClose,
  onAction
}) {
  const timer = useRef()

  const [animateStates] = useState({
    opacity: new Animated.Value(0),
    top: new Animated.Value(getTopPosition(index)),
    right: new Animated.Value(-48)
  })

  useEffect(() => {
    Animated.timing(animateStates.top, {
      toValue: getTopPosition(index),
      duration: 300
    }).start()
  }, [index])

  useEffect(() => {
    if (show) {
      if (!alert) timer.current = setTimeout(onHide, 5000)
      onShow()
    } else {
      onHide()
    }
  }, [show])

  function onShow () {
    Animated.parallel([
      Animated.timing(animateStates.opacity, { toValue: 1, duration: 300 }),
      Animated.timing(animateStates.right, { toValue: MARGIN, duration: 300 })
    ]).start()
  }

  function onHide () {
    clearTimeout(timer.current)
    timer.current = null

    Animated.parallel([
      Animated.timing(animateStates.opacity, { toValue: 0, duration: 150 })
    ]).start(() => {
      onClose && onClose()
    })
  }

  function _onAction () {
    onAction && onAction()
    onClose && onClose()
  }

  return pug`
    Animated.View.animate(style={
      opacity: animateStates.opacity,
      right: animateStates.right,
      top: animateStates.top
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
            onPress=onHide
          )= closeLabel || 'Close'

          if onAction
            Button.actionView(
              size='s'
              styleName=[type]
              onPress=_onAction
            )= actionLabel || 'View'
  `
})

function getTopPosition (index) {
  return (index * STYLES.item.height) + (MARGIN * (index + 1))
}
