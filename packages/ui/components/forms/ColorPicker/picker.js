import React, { useImperativeHandle } from 'react'
import { ColorPicker } from 'react-native-color-picker'
import { pug, observer, useValue } from 'startupjs'
import ScrollView from '../../ScrollView'
import Modal from '../../Modal'
import './index.styl'

function FullHeightScrollView (props) {
  return pug`
    ScrollView(
      contentContainerStyleName='content'
      ...props
    )
  `
}

function Picker ({ onChangeColor }, ref) {
  const [, $visible] = useValue()

  useImperativeHandle(ref, () => ({
    show: () => $visible.set(true),
    hide: () => $visible.set(false)
  }))

  return pug`
    Modal($visible=$visible variant='fullscreen')
      Modal.Content(ContentComponent=FullHeightScrollView)
        ColorPicker.picker(
          onColorSelected=color => {
            onChangeColor(color)
            $visible.set(false)
          }
        )
  `
}

export default observer(Picker, { forwardRef: true })
