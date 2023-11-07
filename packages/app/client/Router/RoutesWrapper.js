import React from 'react'
import Stack from 'react-router-native-stack'
import { pug } from 'startupjs'
const DEFAULT_ANIMATE = false
// Support for web https://github.com/Traviskn/react-router-native-stack/pull/47

export default function RoutesWrapper ({
  animate = DEFAULT_ANIMATE,
  children
}) {
  return pug`
    if animate
      Stack(gestureEnabled=false animationType='slide-horizontal')= children
    else
      = children
  `
}
