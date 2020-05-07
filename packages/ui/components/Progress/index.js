import React, { useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { View, Animated, Easing } from 'react-native'
import propTypes from 'prop-types'
import Span from '../Span'
import './index.styl'
const AnimatedView = Animated.View

function Progress ({
  style,
  value,
  label,
  variant,
  shape
}) {
  const [progress] = useState(new Animated.Value(value))

  // TODO: We can calculate duration using durationOfFullProgress / newValue - prevValue
  useDidUpdate(() => {
    Animated.timing(
      progress,
      {
        toValue: value,
        duration: 300,
        easing: Easing.linear
      }
    ).start()
  }, [value])

  return pug`
    View(style=style)
      View.progress(style={ borderRadius: shape === 'round' ? 4 : 0 })
        AnimatedView.filler(
          style={
            borderRadius: shape === 'round' ? 4 : 0,
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '1%']
            })
          }
        )
      if variant === 'full'
        Span(size='s' description)
          = label || (value < 100 ? Math.round(value) + '% ...' : 'Loading Complete')
  `
}

Progress.defaultProps = {
  value: 0,
  variant: 'full',
  shape: 'round'
}

Progress.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  value: propTypes.number,
  label: propTypes.string,
  variant: propTypes.oneOf(['full', 'compact']),
  shape: propTypes.oneOf(['round', 'square'])
}

export default observer(Progress)
