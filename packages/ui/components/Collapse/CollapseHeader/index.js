import React, { useRef } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { Animated } from 'react-native'
import propTypes from 'prop-types'
import Div from './../../Div'
import Row from './../../Row'
import Icon from './../../Icon'
import Span from './../../Typography/Span'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

function CollapseHeader ({
  style,
  iconStyle,
  containerStyle,
  children,
  variant,
  iconPosition,
  icon,
  open, // @private
  onPress // @private
}) {
  const reverse = iconPosition === 'right'
  const animationProgress = useRef(new Animated.Value(0)).current

  useDidUpdate(() => {
    Animated.timing(
      animationProgress,
      {
        toValue: open ? 1 : 0,
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }, [open])

  return pug`
    Row.root(
      style=style
      styleName=[variant]
      onPress=onPress
      reverse=reverse
    )
      Animated.View(
        style={
          transform: [{
            rotate: animationProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [reverse ? '90deg' : '-90deg', '0deg']
            })
          }]
        }
      )
        Icon(icon=icon style=iconStyle)
      Div.container(style=containerStyle styleName={reverse})
        if typeof children === 'string'
          Span= children
        else
          = children
  `
}

CollapseHeader.defaultProps = {
  icon: faCaretDown,
  iconPosition: 'left'
}

CollapseHeader.propTypes = {
  iconPosition: propTypes.oneOf(['left', 'right']),
  icon: propTypes.object,
  iconStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  containerStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(CollapseHeader)
