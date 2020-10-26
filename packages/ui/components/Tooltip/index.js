import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Text, View } from 'react-native'
import { Popover } from '../popups'
import TooltipCaption from './Caption'
import './index.styl'

function Tooltip ({
  children,
  style,
  wrapperStyle,
  placement
}) {
  const [isVisible, setIsVisible] = useState(false)

  let caption = null
  let content = null
  React.Children.toArray(children).forEach((child, index) => {
    if (child.type === TooltipCaption) {
      if (index !== 0) Error('Caption need use first child')
      caption = React.cloneElement(child, {
        _onChange: value => {
          setIsVisible(value)
        }
      })
    }
    if (child.type === TooltipContent) {
      content = child
    }
  })

  return pug`
    Popover(
      visible=isVisible
      hasArrow=true
      placement='top-left'
      wrapperStyleName='wrapper'
      onDismiss=()=> setIsVisible(false)
    )
      Popover.Caption= caption
      = content
  `
}

const TooltipContent = ({ children, style }) => {
  if (typeof children === 'string') {
    return pug`
      View(style=style)
        Text.text= children
    `
  } else {
    return children
  }
}

const ObservedTooltip = observer(Tooltip)
ObservedTooltip.Caption = TooltipCaption
ObservedTooltip.Content = TooltipContent

export default ObservedTooltip
