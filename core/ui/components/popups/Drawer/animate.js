import { Animated } from 'react-native'

export default {
  show ({
    width,
    height,
    animateStates,
    hasOverlay,
    isHorizontal,
    isInvertPosition,
    isInit
  }, callback) {
    if (isInit) {
      animateStates.position.setValue(
        isHorizontal
          ? isInvertPosition ? -width : width
          : isInvertPosition ? -height : height
      )
    }

    const animations = [
      Animated.timing(animateStates.position, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      })
    ]

    if (hasOverlay) {
      animations.push(
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false
        })
      )
    }

    Animated.parallel(animations).start(callback)
  },

  hide ({
    width,
    height,
    animateStates,
    hasOverlay,
    isHorizontal,
    isInvertPosition
  }, callback) {
    const animations = [
      Animated.timing(animateStates.position, {
        toValue:
          isHorizontal
            ? isInvertPosition ? -width : width
            : isInvertPosition ? -height : height,
        duration: 200,
        useNativeDriver: false
      })
    ]

    if (hasOverlay) {
      animations.push(
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        })
      )
    }

    Animated.parallel(animations).start(callback)
  }
}
