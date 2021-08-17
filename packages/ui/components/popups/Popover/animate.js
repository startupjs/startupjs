import { Animated } from 'react-native'

export default {
  show ({
    geometry,
    contentInfo,
    durationOpen,
    animateType,
    animateStates
  }) {
    const validPlacement = geometry.validPlacement
    const [position, attachment] = validPlacement.split('-')

    if (animateType === 'opacity') {
      animateStates.height.setValue(contentInfo.height)
      animateStates.width.setValue(contentInfo.width)
      if (position === 'top') animateStates.translateY.setValue(10)
      if (position === 'bottom') animateStates.translateY.setValue(-10)
      if (position === 'left') animateStates.translateX.setValue(10)
      if (position === 'right') animateStates.translateX.setValue(-10)

      return Animated.parallel([
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: durationOpen,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateX, {
          toValue: 0,
          duration: durationOpen,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateY, {
          toValue: 0,
          duration: durationOpen,
          useNativeDriver: false
        })
      ])
    }

    if (animateType === 'scale') {
      animateStates.height.setValue(contentInfo.height)
      animateStates.width.setValue(contentInfo.width)
      animateStates.scaleY.setValue(0.9)

      if (position === 'left') animateStates.translateX.setValue(-4)
      if (position === 'right') animateStates.translateX.setValue(4)
      if (attachment === 'center') animateStates.translateX.setValue(0)
      if ((position === 'left' || position === 'right') && attachment === 'top') {
        animateStates.translateY.setValue(-4)
      }
      if ((position === 'left' || position === 'right') && attachment === 'end') {
        animateStates.translateY.setValue(4)
      }
      if ((position === 'top' || position === 'bottom') && attachment === 'start') {
        animateStates.translateX.setValue(-4)
      }
      if ((position === 'top' || position === 'bottom') && attachment === 'end') {
        animateStates.translateX.setValue(4)
      }

      return Animated.parallel([
        Animated.timing(animateStates.scaleY, {
          toValue: 1,
          duration: durationOpen,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.scaleX, {
          toValue: 1,
          duration: durationOpen,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateY, {
          toValue: 0,
          duration: durationOpen,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateX, {
          toValue: 0,
          duration: durationOpen,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.opacity, {
          toValue: 1,
          duration: durationOpen,
          useNativeDriver: false
        })
      ])
    }
  },

  hide ({
    geometry,
    contentInfo,
    durationClose,
    animateType,
    animateStates
  }) {
    if (!geometry) {
      return Animated.timing(animateStates.opacity, {
        toValue: 0,
        duration: durationClose,
        useNativeDriver: false
      })
    }

    animateStates.height.setValue(contentInfo.height)
    const [position, attachment] = (geometry.validPlacement || '').split('-')

    if (animateType === 'opacity') {
      let toTranslateX = 0
      let toTranslateY = 0
      if (position === 'top') toTranslateY = 10
      if (position === 'bottom') toTranslateY = -10
      if (position === 'left') toTranslateX = 10
      if (position === 'right') toTranslateX = -10

      return Animated.parallel([
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: durationClose,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateX, {
          toValue: toTranslateX,
          duration: durationClose,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateY, {
          toValue: toTranslateY,
          duration: durationClose,
          useNativeDriver: false
        })
      ])
    }

    if (animateType === 'scale') {
      animateStates.height.setValue(contentInfo.height)
      animateStates.width.setValue(contentInfo.width)
      let _translateY = 0
      let _translateX = 0
      let _scaleY = 0.96
      let _scaleX = 1

      if (attachment === 'center') _translateX = 0
      if ((position === 'top' || position === 'bottom') && attachment === 'start') {
        _translateX = -4
      }
      if ((position === 'top' || position === 'bottom') && attachment === 'end') {
        _translateX = 4
      }
      if ((position === 'left' || position === 'top') && attachment === 'start') {
        _translateY = -4
      }
      if ((position === 'left' || position === 'top') && attachment === 'end') {
        _translateY = 4
      }
      if (position === 'left') {
        _scaleY = 1
        _scaleX = 0.96
      }
      if (position === 'right') {
        _scaleY = 1
        _scaleX = 0.96
      }

      return Animated.parallel([
        Animated.timing(animateStates.scaleY, {
          toValue: _scaleY,
          duration: durationClose,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.scaleX, {
          toValue: _scaleX,
          duration: durationClose,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateY, {
          toValue: _translateY,
          duration: durationClose,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.translateX, {
          toValue: _translateX,
          duration: durationClose,
          useNativeDriver: false
        }),
        Animated.timing(animateStates.opacity, {
          toValue: 0,
          duration: durationClose,
          useNativeDriver: false
        })
      ])
    }
  }
}
