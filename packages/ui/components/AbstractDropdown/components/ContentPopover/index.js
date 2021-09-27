import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import AbstractPopover from '../../../popups/Popover/AbstractPopover'
import './index.styl'

export default function DropdownPopover ({
  style,
  refAnchor,
  visible,
  position,
  attachment,
  placements,
  renderContent,
  onChangeVisible,
  onRequestOpen
}) {
  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> onChangeVisible(false))
          View.overlay
        = children
    `
  }

  console.log(renderContent())
  return pug`
    AbstractPopover.attachment(
      visible=visible
      refAnchor=refAnchor
      position=position
      attachment=attachment
      placements=placements
      renderWrapper=renderWrapper
      onRequestOpen=onRequestOpen
    )= renderContent()
  `
}
