import React, { useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { Animated } from 'react-native'
import propTypes from 'prop-types'
import Div from './../../Div'
import Icon from './../../Icon'
import Span from './../../Span'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { u } from './../../../config/helpers'
import './index.styl'

const CLOSED_ROTATION_DEGREE = 0
const OPENED_ROTATION_DEGREE = 0.5

function CollapseHeader ({
  style,
  children,
  variant,
  open, // @private
  onPress // @private
}) {
  const [degree] = useState(
    new Animated.Value(open ? OPENED_ROTATION_DEGREE : CLOSED_ROTATION_DEGREE)
  )

  useDidUpdate(() => {
    if (open) {
      Animated.timing(
        degree,
        {

          toValue: OPENED_ROTATION_DEGREE,
          duration: 250,
          useNativeDriver: true
        }
      ).start()
    } else {
      Animated.timing(
        degree,
        {

          toValue: CLOSED_ROTATION_DEGREE,
          duration: 300,
          useNativeDriver: true
        }
      ).start()
    }
  }, [open])

  const content = React.Children.toArray(children).map(child => {
    const style = { paddingRight: u(5) }

    if (typeof child === 'string') {
      return pug`
        Span(
          key='__COLLAPSE_HEADER_KEY__'
          style=style
          numberOfLines=1
        )= child
      `
    }
    return React.cloneElement(child, { style })
  })

  const AnimatedView = Animated.View

  return pug`
    Div.root(
      style=style
      styleName=[variant]
      onPress=onPress
      interactive=variant === 'full'
    )
      = content
      AnimatedView.icon(
        style={
          transform: [{
            rotate: degree.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
          }]

        }
      )
        Icon(
          icon=faCaretDown
        )
  `
}

CollapseHeader.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(CollapseHeader)
