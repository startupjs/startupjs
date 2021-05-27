import React, { useRef, useState } from 'react'
import AnimatedSpawn from './AnimatedSpawn'
import DeprecatedPopover from './Deprecated'
import Div from '../../Div'
import './index.styl'

function _Popover (props) {
  const { children } = props

  if (children[0]?.type?.name === DeprecatedPopover.Caption.name) {
    console.warn('[@startupjs/ui] Popover: Popover.Caption is DEPRECATED, use new api')

    return pug`
      DeprecatedPopover(...props)
    `
  }

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
    AnimatedSpawn.content(
      style=[contentStyle]
      styleName={ contentWithArrow: hasArrow }
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

_Popover.Caption = DeprecatedPopover.Caption

export default _Popover
