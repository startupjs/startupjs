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
    animateScaleY,
    animateScaleX,
    animateTranslateY,
    animateTranslateX,
    animateOpacityOverlay
  }, callback) {
    const [rootPlacement, minorPlacement] = placement.split('-')

    if (animateType === 'default') {
      animateHeight.setValue(0)
      animateWidth.setValue(curWidth)
      let topToValue = animateTop._value
      const leftToValue = animateLeft._value

      if (rootPlacement === 'top') {
        topToValue = animateTop._value - curHeight
      }
      if (rootPlacement === 'left') {
        animateHeight.setValue(curHeight)
        animateWidth.setValue(0)
        animateLeft.setValue(cx)
      }
      if (rootPlacement === 'right') {
        animateHeight.setValue(curHeight)
        animateWidth.setValue(0)
      }

      return Animated.parallel([
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateLeft, {
          toValue: leftToValue,
          duration: 300
        }),
        Animated.timing(animateTop, {
          toValue: topToValue,
          duration: 300
        }),
        Animated.timing(animateHeight, {
          toValue: curHeight,
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

    if (animateType === 'slide') {
      animateHeight.setValue(curHeight)
      let topToValue = animateTop._value
      let leftToValue = animateLeft._value

      if (rootPlacement === 'top') {
        animateTop.setValue(animateTop._value - curHeight + 10)
        topToValue = animateTop._value - 10
      }
      if (rootPlacement === 'bottom') {
        animateTop.setValue(animateTop._value - 10)
        topToValue = animateTop._value + 10
      }
      if (rootPlacement === 'left') {
        animateLeft.setValue(animateLeft._value + 10)
        leftToValue = animateLeft._value - 10
      }
      if (rootPlacement === 'right') {
        animateLeft.setValue(animateLeft._value - 10)
        leftToValue = animateLeft._value + 10
      }

      return Animated.parallel([
        Animated.timing(animateOpacity, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateLeft, {
          toValue: leftToValue,
          duration: 300
        }),
        Animated.timing(animateTop, {
          toValue: topToValue,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0.5,
          duration: 300
        })
      ]).start(callback)
    }

    if (animateType === 'scale') {
      animateScaleY.setValue(0.9)
      animateHeight.setValue(curHeight)
      animateWidth.setValue(curWidth)

      if (minorPlacement === 'left') {
        animateTranslateX.setValue(-4)
      }
      if (minorPlacement === 'center') {
        animateTranslateX.setValue(0)
      }
      if (minorPlacement === 'right') {
        animateTranslateX.setValue(4)
      }
      if (rootPlacement === 'left') {
        animateTranslateX.setValue(-4)
        animateScaleY.setValue(1)
      }
      if (rootPlacement === 'right') {
        animateTranslateX.setValue(4)
        animateScaleY.setValue(1)
      }

      return Animated.parallel([
        Animated.timing(animateScaleY, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateScaleX, {
          toValue: 1,
          duration: 300
        }),
        Animated.timing(animateTranslateY, {
          toValue: 0,
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
    animateScaleY,
    animateScaleX,
    animateTranslateY,
    animateTranslateX,
    animateOpacityOverlay
  }, callback) {
    const [rootPlacement, minorPlacement] = placement.split('-')
    Animated.timing(animateOpacity, { toValue: 0, duration: 400 }).start()

    if (animateType === 'default') {
      let topToValue = animateTop._value
      let widthToValue = animateWidth._value
      let heightToValue = 0
      let leftToValue = animateLeft._value

      if (rootPlacement === 'top') {
        topToValue = animateTop._value + curHeight
      }
      if (rootPlacement === 'left') {
        widthToValue = 0
        leftToValue = animateLeft._value + curWidth
        heightToValue = animateHeight._value
      }
      if (rootPlacement === 'right') {
        widthToValue = 0
        heightToValue = animateHeight._value
      }

      return Animated.parallel([
        Animated.timing(animateWidth, {
          toValue: widthToValue,
          duration: 300
        }),
        Animated.timing(animateLeft, {
          toValue: leftToValue,
          duration: 300
        }),
        Animated.timing(animateHeight, {
          toValue: heightToValue,
          duration: 300
        }),
        Animated.timing(animateTop, {
          toValue: topToValue,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0,
          duration: 400
        })
      ]).start(callback)
    }

    if (animateType === 'slide') {
      let _topToValue = animateTop._value
      let _leftToValue = animateLeft._value
      if (rootPlacement === 'top') _topToValue = animateTop._value + 10
      if (rootPlacement === 'bottom') _topToValue = animateTop._value - 10
      if (rootPlacement === 'left') _leftToValue = animateLeft._value + 10
      if (rootPlacement === 'right') _leftToValue = animateLeft._value - 10

      return Animated.parallel([
        Animated.timing(animateLeft, {
          toValue: _leftToValue,
          duration: 300
        }),
        Animated.timing(animateTop, {
          toValue: _topToValue,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0,
          duration: 400
        })
      ]).start(callback)
    }

    if (animateType === 'scale') {
      animateHeight.setValue(curHeight)
      animateWidth.setValue(curWidth)
      let _translateY = 0
      let _translateX = 0
      let _scaleY = 0.96
      let _scaleX = 1

      if (minorPlacement === 'center') _translateX = 0
      if (minorPlacement === 'left') _translateX = -4
      if (minorPlacement === 'right') _translateX = 4
      if (rootPlacement === 'top') _translateY = -8
      if (rootPlacement === 'bottom') _translateY = 8
      if (rootPlacement === 'left') {
        _scaleY = 1
        _scaleX = 0.96
      }
      if (rootPlacement === 'right') {
        _scaleY = 1
        _scaleX = 0.96
      }

      return Animated.parallel([
        Animated.timing(animateScaleY, {
          toValue: _scaleY,
          duration: 300
        }),
        Animated.timing(animateScaleX, {
          toValue: _scaleX,
          duration: 300
        }),
        Animated.timing(animateTranslateY, {
          toValue: _translateY,
          duration: 300
        }),
        Animated.timing(animateTranslateX, {
          toValue: _translateX,
          duration: 300
        }),
        Animated.timing(animateOpacity, {
          toValue: 0,
          duration: 300
        }),
        Animated.timing(animateOpacityOverlay, {
          toValue: 0,
          duration: 300
        })
      ]).start(() => {
        animateScaleY.setValue(1)
        animateTranslateX.setValue(0)
        animateTranslateY.setValue(0)
        callback()
      })
    }
  }
}
