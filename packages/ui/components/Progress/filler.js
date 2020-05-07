import React, { useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { Animated, Easing } from 'react-native'
import './index.styl'
import config from '../../config/rootConfig'

const { duration } = config.Progress

const AnimatedView = Animated.View

export default observer(function ProgressFiller ({ value, shape }) {
  const [progress] = useState(new Animated.Value(value))

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
      style={
        borderRadius: shape === 'round' ? 4 : 0,
        width: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '1%']
        })
      }
    )
  `
})
