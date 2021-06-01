import React, { useRef, useState } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import AbstractPopover from './AbstractPopover'
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
  arrow,
  hasWidthCaption,
  onRequestOpen,
  onRequestClose
}) {
  const refCaption = useRef(null)
  const [visible, setVisible] = useState(false)

  function renderWrapper (children) {
    return pug`
      View.wrapper
        TouchableWithoutFeedback(onPress=()=> setVisible(false))
          View.overlay
        = children
    `
  }

  return pug`
    Div(
      style=style
      ref=refCaption
      onPress=()=> setVisible(true)
    )= children
    AbstractPopover.content(
      style=[contentStyle]
      styleName={ contentWithArrow: arrow }
      arrowStyle=arrowStyle
      visible=visible
      refCaption=refCaption
      position=position
      arrow=arrow
      attachment=attachment
      placements=placements
      animateType=animateType
      durationOpen=durationOpen
      durationClose=durationClose
      renderWrapper=renderWrapper
      onRequestOpen=onRequestOpen
      onRequestClose=()=> setVisible(false)
    )= renderContent()
  `
}

_Popover.Caption = DeprecatedPopover.Caption

export default _Popover
