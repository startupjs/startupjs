import React, { useRef } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { Animated } from 'react-native'
import propTypes from 'prop-types'
import Div from './../../Div'
import Row from './../../Row'
import Icon from './../../Icon'
import Span from './../../typography/Span'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
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
  onPress, // @private,
  ...props
}) {
  if (icon === true) icon = faCaretRight
  const reverse = iconPosition === 'right'
  const animation = useRef(new Animated.Value(open ? 1 : 0)).current

  useDidUpdate(() => {
    Animated.timing(
      animation,
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
      ...props
    )
      Animated.View(
        style={
          transform: [{
            rotate: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [reverse ? '180deg' : '0deg', '90deg']
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
  icon: true,
  iconPosition: 'left'
}

CollapseHeader.propTypes = {
  iconPosition: propTypes.oneOf(['left', 'right']),
  icon: propTypes.oneOfType([propTypes.bool, propTypes.object, propTypes.func]),
  iconStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  containerStyle: propTypes.oneOfType([propTypes.object, propTypes.array]),
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(CollapseHeader)
