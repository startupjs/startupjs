import React, { useEffect, useState } from 'react'
import { Animated } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import Button from '../Button'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../typography/Span'
import themed from '../../theming/themed'
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

function Toast ({
  type,
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
      Div.toast(styleName=[type])
        Div.header(vAlign='center' row)
          Div(vAlign='center' row)
            Icon.icon(
              icon=icon ? icon : ICONS[type]
              styleName=[type]
            )
            Span.title(styleName=[type])
              = title ? title : TITLES[type]
          Div(onPress=onHide)
            Icon(icon=faTimes)

        if text
          Span.text= text

        if onAction
          Div.actions(row)
            Button(
              size='s'
              onPress=() => {
                onAction()
                onHide()
              }
            )= actionLabel
  `
}

Toast.defaultProps = {
  type: 'info',
  actionLabel: 'View'
}

Toast.propTypes = {
  type: PropTypes.string,
  topPosition: PropTypes.number,
  height: PropTypes.number,
  show: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  text: PropTypes.string,
  title: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
  onLayout: PropTypes.func
}

export default observer(themed(Toast, 'Toast'))
