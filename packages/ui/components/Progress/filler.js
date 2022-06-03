import React, { useState } from 'react'
import { Animated, Easing } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const {
  config: {
    duration
  }
} = STYLES

const AnimatedView = Animated.View

function ProgressFiller ({ style, value }) {
  const [progress] = useState(new Animated.Value(value))
  const [width, setWidth] = useState(0)

  useDidUpdate(() => {
    Animated.timing(
      progress,
      {
        toValue: value,
        duration,
        easing: Easing.linear
      }
    ).start()
  }, [value])


  return pug`
    AnimatedView.filler(
      style=[
        style,
        {
          width: progress.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
          })
        }
      ]
      onLayout=(event) => setWidth(event.nativeEvent.layout.width)
    )
  `
}

export default observer(themed('Progress', ProgressFiller))
