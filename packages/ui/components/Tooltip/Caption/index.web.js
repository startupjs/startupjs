import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'

export default observer(function TooltipCaption ({
  children,
  componentId,
  onChange
}) {
  function onMouseOver () {
    window.addEventListener('mousemove', onWindowMouseMove)
    onChange(true)
  }

  function onWindowMouseMove (e) {
    if (!e.target.closest('#tooltip__' + componentId)) {
      window.removeEventListener('mousemove', onWindowMouseMove)
      onChange(false)
    }
  }

  return pug`
    View(
      nativeID='tooltip__' + componentId
      onMouseOver=onMouseOver
    )= children
  `
})
