import React from 'react'
import Drawer from '../../../popups/Drawer'
import Div from '../../../Div'
import { useKeyboard } from '../../helpers'
import './index.styl'

export default function DropdownDrawer ({
  style,
  visible,
  data,
  position,
  listTitle,
  renderContent,
  onSelectIndex,
  onEnterIndex,
  onRequestOpen,
  onChangeVisible
}) {
  useKeyboard({
    itemsLength: data.length,
    onChange: onSelectIndex,
    onEnter: onEnterIndex
  })

  return pug`
    Drawer.attachment(
      position=position
      visible=visible
      styleName='attachment-' + position
      onDismiss=()=> onChangeVisible(false)
      onRequestOpen=onRequestOpen
    )
      Div.content= renderContent()
  `
}
