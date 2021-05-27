import React, { useRef, useState } from 'react'
import AbstractPopover from './AbstractPopover'
import Div from '../../Div'
import './index.styl'

function _Popover (props) {
  if (!props.renderContent) return null

  return pug`
    Popover(...props)
  `
}

function Popover ({
  style,
  arrowStyle,
  contentStyle,
  children,
  renderContent,
  position,
  attachment,
  placements,
  animateType,
  durationOpen,
  durationClose,
  hasArrow,
  hasWidthCaption,
  onRequestOpen,
  onRequestClose
}) {
  const refCaption = useRef(null)
  const [visible, setVisible] = useState(false)

  return pug`
    Div(
      style=style
      ref=refCaption
      onPress=()=> setVisible(true)
    )= children
    AbstractPopover(
      style=contentStyle
      arrowStyle=arrowStyle
      visible=visible
      refCaption=refCaption
      position=position
      attachment=attachment
      placements=placements
      animateType=animateType
      durationOpen=durationOpen
      durationClose=durationClose
      hasArrow=hasArrow
      onRequestOpen=onRequestOpen
      onRequestClose=()=> setVisible(false)
    )= renderContent()
  `
}

export default _Popover
