import React from 'react'
import { TouchableOpacity } from 'react-native'

export default function TooltipCaption ({
  children,
  style,
  onChange
}) {
  function onLongPress () {
    onChange(true)
  }

  function onPressOut () {
    onChange(false)
  }

  function renderChildren () {
    const mappedChildren = React.Children.toArray(children).map(child => {
      if (child.props.onPress || child.props.onClick || child.props.onLongPress) {
        return React.cloneElement(child, {
          onLongPress,
          onPressOut
        })
      }
      return child
    })

    return mappedChildren
  }

  return pug`
    TouchableOpacity(
      activeOpacity=0.8
      onLongPress=onLongPress
      onPressOut=onPressOut
    )= renderChildren()
  `
}
