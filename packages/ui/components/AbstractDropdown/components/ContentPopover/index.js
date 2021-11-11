import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import AbstractPopover from '../../../AbstractPopover'
import './index.styl'

export default function DropdownPopover ({
  refAnchor,
  visible,
  renderContent,
  onChange
}) {
  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> onChange(false))
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
