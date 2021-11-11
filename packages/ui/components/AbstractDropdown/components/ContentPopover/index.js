import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import AbstractPopover from '../../../AbstractPopover'
import './index.styl'

export default function DropdownPopover ({
  refAnchor,
  visible,
  renderContent,
  onChangeVisible
}) {
  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> onChangeVisible(false))
          View.overlay
        = children
    `
  }

  return pug`
    AbstractPopover.attachment(
      visible=visible
      refAnchor=refAnchor
      renderWrapper=renderWrapper
    )= renderContent()
  `
}
