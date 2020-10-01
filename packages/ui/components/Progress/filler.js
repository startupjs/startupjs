import React, { useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { Animated, Easing } from 'react-native'
import STYLES from './index.styl'

const {
  config: {
    duration
  }
} = STYLES

const AnimatedView = Animated.View

export default observer(function ProgressFiller ({ style, value }) {
  const [progress] = useState(new Animated.Value(value))
  const [width, setWidth] = useState(0)

  useDidUpdate(() => {
    Animated.timing(
      progress,
      {
        toValue: value,
        duration,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start()
  }, [value])

  return pug`
    AnimatedView.filler(
      style=[
        style,
        {
          transform: [{
            translateX: progress.interpolate({
              inputRange: [0, 100],
              outputRange: [-width, 0]
            })
          }]
        }
      ]
      onLayout=(event) => setWidth(event.nativeEvent.layout.width)
    )
  `
})
