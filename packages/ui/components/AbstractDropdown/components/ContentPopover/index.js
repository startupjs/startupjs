import React from 'react'
import AbstractPopover from '../../../AbstractPopover'
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
  return pug`
    AbstractPopover.attachment(
      visible=visible
      refAnchor=refAnchor
      position=position
      attachment=attachment
      placements=placements
      durationClose=200
      onRequestOpen=onRequestOpen
    )= renderContent()
  `
}
