import React, { Children } from 'react'
import { TouchableOpacity } from 'react-native'

export default function TooltipCaption ({
  children,
  onChange
}) {
  function onLongPress () {
    onChange(true)
  }

  function onPressOut () {
    onChange(false)
  }

  let isPressable = false

  let _children = Children.toArray(children).map(child => {
    if (child.props.onPress || child.props.onClick || child.props.onLongPress) {
      isPressable = true
      return React.cloneElement(child, {
        onLongPress,
        onPressOut
      })
    }
    return child
  })

  if (_children.length !== 1) {
    console.error('[ui -> Tooltip] You must specify a single child')
    return null
  }

  if (isPressable) return _children

  return pug`
    TouchableOpacity(
      activeOpacity=0.8
      onLongPress=onLongPress
      onPressOut=onPressOut
    )= _children
  `
}
