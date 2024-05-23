import React, { useRef, useEffect, useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import './index.styl'

function Picker ({ onChangeColor }, ref) {
  const pickerRef = useRef()

  useImperativeHandle(ref, () => ({
    show: () => pickerRef.current.click(),
    hide: () => {
      // hacky way to close the color picker
      pickerRef.current.setAttribute('type', 'text')
      pickerRef.current.setAttribute('type', 'color')
    }
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
