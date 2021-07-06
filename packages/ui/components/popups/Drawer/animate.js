import { Animated } from 'react-native'

export default {
  show ({
    width,
    height,
    animateStates,
    hasOverlay,
    isHorizontal,
    isInvertPosition,
    isInit,
    durationOpen
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
        duration: durationOpen,
        useNativeDriver: false
      })
    ]

    if (hasOverlay) {
      animations.push(
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: durationOpen,
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
    isInvertPosition,
    durationHide
  }, callback) {
    const animations = [
      Animated.timing(animateStates.position, {
        toValue:
          isHorizontal
            ? isInvertPosition ? -width : width
            : isInvertPosition ? -height : height,
        duration: durationHide,
        useNativeDriver: false
      })
    ]

    if (hasOverlay) {
      animations.push(
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: durationHide,
          useNativeDriver: false
        })
      )
    }

    Animated.parallel(animations).start(callback)
  }
}
