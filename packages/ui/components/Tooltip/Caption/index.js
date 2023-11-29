import React from 'react'
import { TouchableOpacity } from 'react-native'
import { pug, observer } from 'startupjs'

export default observer(function TooltipCaption ({ children, onChange }) {
  let isPressable = false

  function _onLongPress (cb) {
    onChange(true)
    cb && cb()
  }

  function _onPressOut (cb) {
    onChange(false)
    cb && cb()
  }

  const _children = React.Children.toArray(children).map(child => {
    if (child.props.onPress || child.props.onLongPress) {
      isPressable = true
      return React.cloneElement(child, {
        onLongPress: () => _onLongPress(child.props.onLongPress),
        onPressOut: () => _onPressOut(child.props.onPressOut),
        onPress: child.props.onPress || child.props.onLongPress
      })
    }
    return child
  })

  if (isPressable && _children.length > 1) {
    console.error('[ui -> Tooltip] You must specify a single child')
    return null
  }

  if (isPressable) return _children
  return pug`
    TouchableOpacity(
      activeOpacity=0.8
      onLongPress=()=> _onLongPress()
      onPressOut=()=> _onPressOut()
    )= _children
  `
})
