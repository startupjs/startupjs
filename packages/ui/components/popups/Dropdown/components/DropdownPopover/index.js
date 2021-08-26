import React, { useRef } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import AbstractPopover from '../../../Popover/AbstractPopover'
import Div from '../../../../Div'
import './index.styl'

export default function DropdownPopover ({
  style,
  visible,
  children,
  position,
  attachment,
  placements,
  renderContent,
  onChangeVisible,
  onRequestOpen
}) {
  const refAnchor = useRef()

  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> onChangeVisible(false))
          View.overlay
        = children
    `
  }

  return pug`
    Div.anchor(
      style=style
      ref=refAnchor
      onPress=()=> onChangeVisible(true)
    )= children
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
