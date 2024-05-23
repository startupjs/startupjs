import React, { useRef } from 'react'
import { Animated } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import Div from './../../Div'
import Icon from './../../Icon'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
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
    Div.root(
      row
      style=style
      styleName=[variant]
      onPress=onPress
      reverse=reverse
      ...props
    )
      if icon
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
  iconPosition: PropTypes.oneOf(['left', 'right']),
  icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(themed('CollapseHeader', CollapseHeader))
