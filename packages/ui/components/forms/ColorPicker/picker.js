import React, { useImperativeHandle } from 'react'
import { ColorPicker } from 'react-native-color-picker'
import { observer, useValue } from 'startupjs'
import { Modal } from '@startupjs/ui'
import './index.styl'

function Picker ({ onChangeColor }, ref) {
  const [, $visible] = useValue()

  useImperativeHandle(ref, () => ({
    show: () => $visible.set(true)
  }))

  return pug`
    Modal($visible=$visible variant='fullscreen')
      ColorPicker.picker(
        onColorSelected=color => {
          onChangeColor(color)
          $visible.set(false)
        }
      )
  `
}

export default observer(Picker, { forwardRef: true })
