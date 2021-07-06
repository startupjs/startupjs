import React, { useEffect } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'

export default observer(function TooltipCaption ({ children, onChange }) {
  // const refTimeout = useRef()

  useEffect(() => {
    window.addEventListener('wheel', onDisable, true)
    return () => window.removeEventListener('wheel', onDisable)
  }, [])

  function onMouseOver () {
    onChange(true)
  }

  function onDisable () {
    onChange(false)
  }

  return pug`
    View(
      onMouseOver=onMouseOver
      onMouseLeave=onDisable
    )= children
  `
})
