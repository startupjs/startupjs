import React, { useRef, useEffect, useImperativeHandle } from 'react'
import { observer } from 'startupjs'
import './index.styl'

function Picker ({ onChangeColor }, ref) {
  const pickerRef = useRef()

  useImperativeHandle(ref, () => ({
    show: () => pickerRef.current.click()
  }))

  function onChange (e) {
    onChangeColor(e.target.value)
  }

  useEffect(() => {
    const colorPicker = pickerRef.current
    colorPicker.addEventListener('change', onChange, false)
    return () => colorPicker.removeEventListener('change', onChange, false)
  }, [])

  return pug`
    input(
      ref=pickerRef
      type='color'
      style={
        visibility: 'hidden',
        position: 'absolute',
        alignSelf: 'center'
      }
    )
  `
}

export default observer(Picker, { forwardRef: true })
