import React from 'react'
import Drawer from '../../../popups/Drawer'
import Div from '../../../Div'
import './index.styl'

export default function DropdownDrawer ({
  style,
  visible,
  position,
  listTitle,
  renderContent,
  onChangeVisible,
  onRequestOpen
}) {
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
