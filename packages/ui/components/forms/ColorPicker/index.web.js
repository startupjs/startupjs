import React, { useRef, useEffect } from 'react'
import { observer } from 'startupjs'
import { Button, Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { getLabelColor } from './helpers'
import themed from '../../../theming/themed'
import './index.styl'

function ColorPicker ({
  style,
  value,
  size,
  disabled,
  onChangeColor
}) {
  const pickerRef = useRef()

  function onChange (e) {
    onChangeColor(e.target.value)
  }

  useEffect(() => {
    const colorPicker = pickerRef.current
    colorPicker.addEventListener('change', onChange, false)
    return () => colorPicker.removeEventListener('change', onChange, false)
  }, [])

  return pug`
    Div.root(style=style)
      input(
        ref=pickerRef
        type='color'
        style={
          visibility: 'hidden',
          position: 'absolute',
          alignSelf: 'center'
        }
      )
      Button.button(
        disabled=disabled
        style={ backgroundColor: value }
        variant='flat'
        size=size
        textStyle={ color: getLabelColor(value) }
        onPress=() => pickerRef.current.click()
      )
        = value.toUpperCase()

  `
}

ColorPicker.defaultProps = {
  size: 'm',
  disabled: false,
  value: '#fff',
  onChangeColor: () => {}
}

ColorPicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onChangeColor: PropTypes.func
}

export default observer(
  themed('ColorPicker', ColorPicker),
  { forwardRef: true }
)
