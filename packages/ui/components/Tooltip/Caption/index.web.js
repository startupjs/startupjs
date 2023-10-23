import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { pug, observer } from 'startupjs'

export default observer(function TooltipCaption ({ children, onChange }) {
  const refTimeout = useRef()

  useEffect(() => {
    window.addEventListener('wheel', onDisable, true)
    return () => window.removeEventListener('wheel', onDisable)
  }, [])

  function onMouseOver () {
    refTimeout.current = setTimeout(() => {
      if (!refTimeout.current) return
      onChange(true)
    }, 200)
  }

  function onDisable () {
    clearTimeout(refTimeout.current)
    onChange(false)
    refTimeout.current = null
  }

  return pug`
    View(
      onMouseOver=onMouseOver
      onMouseLeave=onDisable
    )= children
  `
})
