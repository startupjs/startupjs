import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import AbstractPopover from '../../../AbstractPopover'
import { useKeyboard } from '../../helpers'
import './index.styl'

export default function DropdownPopover ({
  style,
  refAnchor,
  visible,
  data,
  position,
  attachment,
  placements,
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
      position=position
      attachment=attachment
      placements=placements
      renderWrapper=renderWrapper
      onRequestOpen=onRequestOpen
    )= renderContent()
  `
}
