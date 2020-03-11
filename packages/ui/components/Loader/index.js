import React, { useState, useLayoutEffect, useMemo } from 'react'
import { observer } from 'startupjs'
import { View, Animated, Easing } from 'react-native'
import propTypes from 'prop-types'
import config from '../../config/rootConfig'
import './index.styl'

const { sizes, bubbleSizes, bubblesCount } = config.Loader
const AnimatedView = Animated.View
const BUBBLE_SIZE = 2

function Loader ({
  style,
  color,
  size,
  duration
}) {
  const _size = sizes[size]
  // we use scaleRatio instead of width, height
  // because for odd width, height border-radius does not round off corners
  const scaleRatio = bubbleSizes[size] / BUBBLE_SIZE
  const [progress] = useState(new Animated.Value(0))
  const angel = 360 / bubblesCount
  const bubbles = Array(bubblesCount).fill(null)
  const _color = useMemo(() => config.colors[color] || color, [color])

  function startAnimation () {
    // we loop the animation manually
    // because Animated.loop does not work with useNativeDriver
    progress.setValue(0)
    Animated.timing(progress, {
      duration,
      easing: Easing.linear,
      toValue: 1,
      useNativeDriver: true
    }).start(startAnimation)
  }

  useLayoutEffect(() => {
    startAnimation()
  }, [])

  // generate scale for transform scale from 0 to 1
  const inputRange = Array
    .from(new Array(bubblesCount + 1), (item, index) => index / bubblesCount)

  // generate scale transform for each bubble
  const outputRanges = bubbles.map((item, index) => {
    // generate range from 1 to 2
    let outputRange = Array
      .from(new Array(bubblesCount), (item, bubbleIndex) => {
        return scaleRatio * (1 + bubbleIndex / (bubblesCount - 1))
      })
    // move the elements in order that the max possible
    // value is at one place on screen for all bubbles
    for (let j = 0; j < index; j++) {
      outputRange.unshift(outputRange.pop())
    }
    // we need to start and finish animation with the same value for smoothness
    // because 0 and 1 it is the same point in inputRange
    // and inputRange we generate from 0 to 1 (not from 0 to 0.85)
    // because animation can't loop itself and can't understand
    // that the next value after 0.85 is 0
    outputRange.unshift(...outputRange.slice(-1))
    return outputRange.reverse()
  })

  return pug`
    //- the reason to start from 45 deg is that the max
    //- possible value must be on top of circle
    AnimatedView.root(
      style=[
        style,
        {
          width: _size,
          height: _size,
          transform: [{
            rotate: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['45deg', '405deg']
            })
          }]
        }
      ]
    )
      each bubble, index in bubbles
        View.bubble-container(
          key=index
          style={
            width: _size,
            height: _size,
            transform: [{
              rotate: index * angel + 'deg',
            }]
          }
        )
          AnimatedView.bubble(
            style={
              backgroundColor: _color,
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
              transform: [{
                scale: progress.interpolate({
                  inputRange: inputRange,
                  outputRange: outputRanges[index]
                })
              }],
            }
          )
  `
}

Loader.defaultProps = {
  color: 'primary',
  size: 'm',
  duration: 4000
}

Loader.propTypes = {
  color: propTypes.string,
  size: propTypes.oneOf(Object.keys(sizes)),
  duration: propTypes.number
}

export default observer(Loader)
