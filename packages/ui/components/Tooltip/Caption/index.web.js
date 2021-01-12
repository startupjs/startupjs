import React, { useRef } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'

export default observer(function TooltipCaption ({ children, onChange }) {
  const refTimeout = useRef()

  function onMouseOver () {
    refTimeout.current = setTimeout(() => {
      if (!refTimeout.current) return
      onChange(true)
    }, 200)
  }

  function onMouseLeave () {
    clearTimeout(refTimeout.current)
    onChange(false)
    refTimeout.current = null
  }

  return pug`
    View(
      onMouseOver=onMouseOver
      onMouseLeave=onMouseLeave
    )= children
  `
})
