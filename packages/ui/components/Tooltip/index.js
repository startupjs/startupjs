import React, { useState } from 'react'
import Popover from '../popups'
import TooltipCaption from './Caption'

function Tooltip ({
  children,
  style,
  width
}) {
  const [isVisible, setIsVisible] = useState(false)

  // parse children
  const caption = null
  const content = null

  return pug`
    Popover(
      visible=isVisible
      hasArrow=true
      styleWrapper=''
      onDismiss=()=> setIsVisible(false)
    )
      Popover.Caption= caption
      = content
  `
}

const TooltipContent = ({ children }) => children
Tooltip.TooltipCaption = TooltipCaption
Tooltip.TooltipContent = TooltipContent

export default Tooltip
