import { Animated } from 'react-native'

export default {
  show ({
    geometry,
    contentInfo,
    durationOpen,
    animateType,
    animateStates,
    hasArrow
  }, callback) {
    const validPlacement = geometry.validPlacement
    const [rootPlacement, minorPlacement] = validPlacement.split('-')

    if (animateType === 'default') {
      animateStates.height.setValue(0)
      animateStates.width.setValue(contentInfo.width)

      if (rootPlacement === 'left' || rootPlacement === 'right') {
        animateStates.width.setValue(0)
      }
      if ((rootPlacement === 'left' || rootPlacement === 'right') && hasArrow) {
        animateStates.height.setValue(contentInfo.height)
      }
      if (validPlacement === 'left-center' || validPlacement === 'right-center') {
        animateStates.height.setValue(contentInfo.height)
      }

      return Animated.parallel([
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: durationOpen
        }),
        Animated.timing(animateStates.height, {
          toValue: contentInfo.height,
          duration: durationOpen
        }),
        Animated.timing(animateStates.width, {
          toValue: contentInfo.width,
          duration: durationOpen
        }),
        Animated.timing(animateStates.opacityOverlay, {
          toValue: 1,
          duration: durationOpen
        })
      ]).start(callback)
    }

    if (animateType === 'slide') {
      animateStates.height.setValue(contentInfo.height)
      animateStates.width.setValue(contentInfo.width)
      if (rootPlacement === 'top') animateStates.translateY.setValue(10)
      if (rootPlacement === 'bottom') animateStates.translateY.setValue(-10)
      if (rootPlacement === 'left') animateStates.translateX.setValue(10)
      if (rootPlacement === 'right') animateStates.translateX.setValue(-10)

      return Animated.parallel([
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: durationOpen
        }),
        Animated.timing(animateStates.translateX, {
          toValue: 0,
          duration: durationOpen
        }),
        Animated.timing(animateStates.translateY, {
          toValue: 0,
          duration: durationOpen
        }),
        Animated.timing(animateStates.opacityOverlay, {
          toValue: 1,
          duration: durationOpen
        })
      ]).start(callback)
    }

    if (animateType === 'scale') {
      animateStates.height.setValue(contentInfo.height)
      animateStates.width.setValue(contentInfo.width)
      animateStates.scaleY.setValue(0.9)

      if (minorPlacement === 'left') animateStates.translateX.setValue(-4)
      if (minorPlacement === 'center') animateStates.translateX.setValue(0)
      if (minorPlacement === 'right') animateStates.translateX.setValue(4)
      if (rootPlacement === 'left') animateStates.translateX.setValue(-4)
      if (rootPlacement === 'right') animateStates.translateX.setValue(4)
      if (minorPlacement === 'top') animateStates.translateY.setValue(-4)
      if (minorPlacement === 'bottom') animateStates.translateY.setValue(4)

      return Animated.parallel([
        Animated.timing(animateStates.scaleY, {
          toValue: 1,
          duration: durationOpen
        }),
        Animated.timing(animateStates.scaleX, {
          toValue: 1,
          duration: durationOpen
        }),
        Animated.timing(animateStates.translateY, {
          toValue: 0,
          duration: durationOpen
        }),
        Animated.timing(animateStates.translateX, {
          toValue: 0,
          duration: durationOpen
        }),
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: durationOpen
        }),
        Animated.timing(animateStates.opacityOverlay, {
          toValue: 1,
          duration: durationOpen
        })
      ]).start(callback)
    }
  },

  hide ({
    geometry,
    contentInfo,
    durationClose,
    animateType,
    animateStates,
    hasArrow
  }, callback) {
    animateStates.height.setValue(contentInfo.height)
    const [rootPlacement, minorPlacement] = geometry.validPlacement.split('-')

    if (animateType === 'default') {
      let widthToValue = animateStates.width._value
      let heightToValue = 0

      if (rootPlacement === 'left') widthToValue = 0
      if (rootPlacement === 'right') widthToValue = 0
      if ((rootPlacement === 'left' || rootPlacement === 'right') && hasArrow) {
        heightToValue = animateStates.height._value
      }

      return Animated.parallel([
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: durationClose
        }),
        Animated.timing(animateStates.width, {
          toValue: widthToValue,
          duration: durationClose
        }),
        Animated.timing(animateStates.height, {
          toValue: heightToValue,
          duration: durationClose
        }),
        Animated.timing(animateStates.opacityOverlay, {
          toValue: 0,
          duration: durationClose
        })
      ]).start(callback)
    }

    if (animateType === 'slide') {
      let toTranslateX = 0
      let toTranslateY = 0
      if (rootPlacement === 'top') toTranslateY = 10
      if (rootPlacement === 'bottom') toTranslateY = -10
      if (rootPlacement === 'left') toTranslateX = 10
      if (rootPlacement === 'right') toTranslateX = -10

      return Animated.parallel([
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: durationClose
        }),
        Animated.timing(animateStates.translateX, {
          toValue: toTranslateX,
          duration: durationClose
        }),
        Animated.timing(animateStates.translateY, {
          toValue: toTranslateY,
          duration: durationClose
        }),
        Animated.timing(animateStates.opacityOverlay, {
          toValue: 0,
          duration: durationClose
        })
      ]).start(callback)
    }

    if (animateType === 'scale') {
      animateStates.height.setValue(contentInfo.height)
      animateStates.width.setValue(contentInfo.width)
      let _translateY = 0
      let _translateX = 0
      let _scaleY = 0.96
      let _scaleX = 1

      if (minorPlacement === 'center') _translateX = 0
      if (minorPlacement === 'left') _translateX = -4
      if (minorPlacement === 'right') _translateX = 4
      if (minorPlacement === 'top') _translateY = -4
      if (minorPlacement === 'bottom') _translateY = 4
      if (rootPlacement === 'left') {
        _scaleY = 1
        _scaleX = 0.96
      }
      if (rootPlacement === 'right') {
        _scaleY = 1
        _scaleX = 0.96
      }

      return Animated.parallel([
        Animated.timing(animateStates.scaleY, {
          toValue: _scaleY,
          duration: durationClose
        }),
        Animated.timing(animateStates.scaleX, {
          toValue: _scaleX,
          duration: durationClose
        }),
        Animated.timing(animateStates.translateY, {
          toValue: _translateY,
          duration: durationClose
        }),
        Animated.timing(animateStates.translateX, {
          toValue: _translateX,
          duration: durationClose
        }),
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: durationClose
        }),
        Animated.timing(animateStates.opacityOverlay, {
          toValue: 0,
          duration: durationClose
        })
      ]).start(callback)
    }
  }
}
