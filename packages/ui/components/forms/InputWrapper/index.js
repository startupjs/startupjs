import React, { useMemo, useState } from 'react'
import { View, Animated } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import colorToRGBA from '../../../config/colorToRGBA'
import './index.styl'

const SCALE_TIMING = 280
const FADE_TIMING = 80

function InputWrapper ({
  style,
  children,
  hover,
  active,
  checked,
  color,
  shape,
  ...props
}) {
  // need this variable to controll active state inside wrapper
  const [_active, setActive] = useState(active)
  const [scaleAnimation] = useState(new Animated.Value(0))
  const [opacityAnimation] = useState(new Animated.Value(1))

  const backgroundColor = useMemo(() => {
    if (!hover && !active && !checked) return
    if (_active) return colorToRGBA(color, 0.25)
    if (hover) return colorToRGBA(color, 0.05)
    if (checked) return colorToRGBA(color, 0.25)
  }, [color, hover, active, checked, _active])

  useDidUpdate(() => {
    if (active) {
      setActive(true)
      scaleAnimation.setValue(0)
    }
    opacityAnimation.setValue(1)
    Animated.timing(
      scaleAnimation,
      {
        toValue: 1,
        duration: SCALE_TIMING
      }
    ).start(() => {
      if (!active) {
        Animated.timing(
          opacityAnimation,
          {
            toValue: 0,
            duration: FADE_TIMING
          }
        ).start(() => {
          setActive()
          if (hover) opacityAnimation.setValue(1)
        })
      }
    })
  }, [active])

  useDidUpdate(() => {
    if (hover) {
      scaleAnimation.setValue(0)
      opacityAnimation.setValue(1)
      Animated.timing(
        scaleAnimation,
        {
          toValue: 1,
          duration: SCALE_TIMING
        }
      ).start()
    } else {
      scaleAnimation.setValue(0)
      opacityAnimation.setValue(1)
    }
  }, [hover])

  // Cleanup effect !!!

  return pug`
    View.root(
      style=[style]
      styleName=[shape]
      activeOpacity=1
      ...props
    )
      Animated.View.background(
        style={
          backgroundColor,
          opacity: opacityAnimation,
          transform: [{
            scale: scaleAnimation
          }]
        }
      )
      View.content
        = children
  `
}

InputWrapper.propTypes = {
  shape: propTypes.oneOf(['rounded', 'circle', 'squared'])
}

InputWrapper.defaultProps = {
  shape: 'circle'
}

export default observer(InputWrapper)
