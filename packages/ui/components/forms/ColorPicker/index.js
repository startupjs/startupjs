import React, { useRef } from 'react'
import { observer } from 'startupjs'
import { Button, Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
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
}) {
  const pickerRef = useRef()

  return pug`
    Div.root(style=style)
      Picker(ref=pickerRef onChangeColor=onChangeColor)
      Button.button(
        disabled=disabled
        style={ backgroundColor: value }
        variant='flat'
        size=size
        textStyle={ color: getLabelColor(value) }
        onPress=() => pickerRef.current.show()
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
