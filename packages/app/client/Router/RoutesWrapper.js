import React from 'react'
import Stack from 'react-router-native-stack'
const DEFAULT_ANIMATE = false
// Support for web https://github.com/Traviskn/react-router-native-stack/pull/47

export default function RoutesWrapper ({
  animate = DEFAULT_ANIMATE,
  children
}) {
  return pug`
    // TODO VITE restore animation router
    if animate
      Stack(gestureEnabled=false animationType='slide-horizontal')= children
    else
      = children
  `
}
