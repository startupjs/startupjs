import React from 'react'
import { ColorPicker as Picker } from 'react-native-color-picker'
import { observer, useValue } from 'startupjs'
import { Modal, Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { getLabelColor } from './helpers'
import themed from '../../../theming/themed'
import './index.styl'

function ColorPicker ({
  style,
  size,
  value,
  disabled,
  onChangeColor
}) {
  const [, $visible] = useValue()

  return pug`
    Button.button(
      style=[style, { backgroundColor: value }]
      variant='flat'
      size=size
      disabled=disabled
      textStyle={ color: getLabelColor(value) }
      onPress=() => $visible.set(true)
    )= value.toUpperCase()
    Modal($visible=$visible variant='fullscreen')
      Picker.picker(
        onColorSelected=color => {
          onChangeColor(color)
          $visible.set(false)
        }
      )
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
