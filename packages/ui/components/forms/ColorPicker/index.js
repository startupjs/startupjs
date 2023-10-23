import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Button from '../../Button'
import { getLabelColor } from './helpers'
import Picker from './picker'
import themed from '../../../theming/themed'
import './index.styl'

function ColorPicker ({
  style,
  size,
  value,
  disabled,
  onChangeColor
}, ref) {
  const [shown, setShown] = useState(false)
  const pickerRef = useRef()

  useImperativeHandle(ref, () => pickerRef.current, [])

  useEffect(() => {
    if (shown && disabled) pickerRef.current.hide()
  }, [disabled])

  return pug`
    Div(style=style)
      Picker(
        ref=pickerRef
        onChangeColor=(color) => {
          onChangeColor(color)
          setShown(false)
        }
      )
      Button.button(
        disabled=disabled
        style={ backgroundColor: value }
        variant='flat'
        size=size
        textStyle={ color: getLabelColor(value) }
        onPress=() => {
          pickerRef.current.show()
          setShown(true)
        }
      )= value.toUpperCase()

  `
}

ColorPicker.defaultProps = {
  size: 'm',
  disabled: false,
  value: '#fff'
}

ColorPicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['s', 'm', 'l']),
  onChangeColor: PropTypes.func
}

export default observer(
  themed('ColorPicker', ColorPicker),
  { forwardRef: true }
)
