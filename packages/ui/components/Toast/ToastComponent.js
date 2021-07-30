import React, { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { observer, useModel } from 'startupjs'
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
const MAX_SHOW_LENGTH = 3

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
  icon,
  text,
  title,
  closeLabel,
  actionLabel,
  onClose,
  onAction,
  _index,
  _toastId,
  _toastsLength
}) {
  const $toasts = useModel('_session.toasts')
  const timer = useRef()

  const [animateStates] = useState({
    opacity: new Animated.Value(0),
    top: new Animated.Value(getTopPosition((_toastsLength - 1) - _index)),
    right: new Animated.Value(-48)
  })

  useEffect(() => {
    if (!alert) timer.current = setTimeout(onHide, 5000)
    onShow()
  }, [])

  // change index
  useEffect(() => {
    Animated.timing(animateStates.top, {
      toValue: getTopPosition((_toastsLength - 1) - _index),
      duration: 300
    }).start()

    if (MAX_SHOW_LENGTH === (_toastsLength - 1 - _index)) {
      onHide()
    }
  }, [_toastsLength])

  function onShow () {
    Animated.parallel([
      Animated.timing(animateStates.opacity, { toValue: 1, duration: 300 }),
      Animated.timing(animateStates.right, { toValue: MARGIN, duration: 300 })
    ]).start()
  }

  function onHide () {
    Animated.parallel([
      Animated.timing(animateStates.opacity, { toValue: 0, duration: 300 })
    ]).start(() => {
      $toasts.at(_toastId).del()
    })
  }

  function _onClose () {
    clearTimeout(timer.current)
    timer.current = null
    onClose && onClose()
    onHide()
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

          Div(onPress=_onClose)
            Icon(icon=faTimes)

        Span.text= text

        Row.actions
          Button(
            size='s'
            onPress=_onClose
          )= closeLabel || 'Close'

          if onAction
            Button.actionView(
              size='s'
              styleName=[type]
              onPress=onAction
            )= actionLabel || 'View'
  `
})

function getTopPosition (index) {
  return (index * STYLES.item.height) + (MARGIN * (index + 1))
}
