import React from 'react'
import Drawer from '../../../popups/Drawer'
import Div from '../../../Div'
import './index.styl'

export default function DropdownDrawer ({
  visible,
  renderContent,
  onChange
}) {
  return pug`
    Drawer.attachment(
      visible=visible
      onDismiss=()=> onChange(false)
    )
      Div.content= renderContent()
  `
}
