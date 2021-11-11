import React from 'react'
import Drawer from '../../../popups/Drawer'
import Div from '../../../Div'
import './index.styl'

export default function DropdownDrawer ({
  visible,
  renderContent,
  onChangeVisible
}) {
  return pug`
    Drawer.attachment(
      visible=visible
      onDismiss=()=> onChangeVisible(false)
    )
      Div.content= renderContent()
  `
}
