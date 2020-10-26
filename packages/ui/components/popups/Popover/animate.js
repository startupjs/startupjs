import { Animated } from 'react-native'

export default {
  show ({
    cx,
    placement,
    curHeight,
    curWidth,
    animateType,
    animateHeight,
    animateOpacity,
    animateTop,
    animateLeft,
    animateWidth,
    animateScale,
    animateTranslateX,
    animateOpacityOverlay
  }, callback) {
    const [rootPlacement, minorPlacement] = placement.split('-')

    if (animateType === 'default' && rootPlacement === 'top') {
      return Animated.parallel([
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateTop, {
          toValue: animateTop._value - curHeight,
          duration: 300
        }),
        Animated.timing(animateHeight, {
          toValue: curHeight,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0.5,
          duration: 300
        })
      ]).start(callback)
    }

    if (animateType === 'default' && rootPlacement === 'left') {
      const animateLeftValue = animateLeft._value
      animateLeft.setValue(cx)
      animateWidth.setValue(0)
      animateHeight.setValue(curHeight)

      return Animated.parallel([
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateWidth, {
          toValue: curWidth,
          duration: 300
        }),
        Animated.timing(animateLeft, {
          toValue: animateLeftValue,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0.5,
          duration: 300
        })
      ]).start(callback)
    }

    if (animateType === 'default' && rootPlacement === 'right') {
      animateHeight.setValue(curHeight)
      animateWidth.setValue(0)

      return Animated.parallel([
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateWidth, {
          toValue: curWidth,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0.5,
          duration: 300
        })
      ]).start(callback)
    }

    if (animateType === 'default' && rootPlacement === 'bottom') {
      return Animated.parallel([
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateHeight, {
          toValue: curHeight,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0.5,
          duration: 300
        })
      ]).start(callback)
    }

    if (animateType === 'slide') {
      animateHeight.setValue(curHeight)

      return Animated.parallel([
        Animated.timing(animateOpacity, { toValue: 1, duration: 300 }),
        animateType === 'slide' && Animated.timing(animateTop, {
          toValue: animateTop._value + 20, duration: 300
        }),
        animateType !== 'slide' && Animated.timing(animateHeight, {
          toValue: curHeight, duration: 300
        }),
        animateType === 'scale' && Animated.timing(animateWidth, {
          toValue: curWidth, duration: 300
        }),
        Animated.timing(animateOpacityOverlay, { toValue: 0.5, duration: 300 })
      ]).start(callback)
    }

    if (animateType === 'scale') {
      let _translateX = -28
      if (minorPlacement === 'center') _translateX = -18
      if (minorPlacement === 'right') _translateX = 0
      animateScale.setValue(0.9)
      animateHeight.setValue(curHeight)
      animateWidth.setValue(curWidth)
      animateTranslateX.setValue(_translateX)

      return Animated.parallel([
        Animated.timing(animateScale, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateTranslateX, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0.5,
          duration: 300
        })
      ]).start(callback)
    }
  },

  hide ({
    placement,
    curHeight,
    curWidth,
    animateType,
    animateTop,
    animateOpacity,
    animateHeight,
    animateLeft,
    animateWidth,
    animateOpacityOverlay
  }, callback) {
    const [rootPlacement] = placement.split('-')
    Animated.timing(animateOpacity, { toValue: 0, duration: 400 }).start()

    if (animateType === 'default' && rootPlacement === 'top') {
      return Animated.parallel([
        Animated.timing(animateHeight, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(animateTop, {
          toValue: animateTop._value + curHeight,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0,
          duration: 400
        })
      ]).start(callback)
    }

    if (animateType === 'default' && rootPlacement === 'left') {
      return Animated.parallel([
        Animated.timing(animateWidth, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(animateLeft, {
          toValue: animateLeft._value + curWidth,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0,
          duration: 400
        })
      ]).start(callback)
    }

    if (animateType === 'default' && rootPlacement === 'right') {
      return Animated.parallel([
        Animated.timing(animateWidth, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0,
          duration: 400
        })
      ]).start(callback)
    }

    if (animateType === 'default' && rootPlacement === 'bottom') {
      return Animated.parallel([
        animateType === 'slide' && Animated.timing(animateTop, {
          toValue: animateTop._value - 20, duration: 300
        }),
        animateType !== 'slide' && Animated.timing(animateHeight, {
          toValue: 0, duration: 300
        }),
        animateType === 'scale' && Animated.timing(animateWidth, {
          toValue: 0, duration: 300
        }),
        Animated.timing(animateOpacityOverlay, { toValue: 0, duration: 400 })
      ]).start(callback)
    }
  }
}
