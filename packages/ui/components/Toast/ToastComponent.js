import React, { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { observer } from 'startupjs'
import Alert from '../Alert'
import './index.styl'

export default observer(function ToastComponent ({
  alert = false,
  toastId,
  children,
  ...props
}) {
  const fullHeight = useRef(null)
  const [isAnimate, setIsAnimate] = useState(false)
  const [isShow, setIsShow] = useState(true)
  const [animateStates] = useState({
    opacity: new Animated.Value(1),
    height: new Animated.Value(null)
  })

  useEffect(() => {
    if (!alert) setTimeout(onHide, 3000)
  }, [])

  function onHide () {
    animateStates.height.setValue(fullHeight.current)
    setIsAnimate(true)

    Animated.parallel([
      Animated.timing(animateStates.opacity, { toValue: 0, duration: 300 }),
      Animated.timing(animateStates.height, { toValue: 0, duration: 300 })
    ]).start(() => setIsShow(false))
  }

  function onClose () {
    if (props.onClose) props.onClose()
    else onHide()
  }

  function onLayout ({ nativeEvent }) {
    fullHeight.current = nativeEvent.layout.height
  }

  return pug`
    if isShow
      Animated.View.alert(
        style={
          opacity: animateStates.opacity,
          height: isAnimate ? animateStates.height : 'auto'
        }
        onLayout=onLayout
      )
        Alert(
          ...props
          onClose=onClose
        )
  `
})
