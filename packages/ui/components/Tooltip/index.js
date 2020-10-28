import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Span } from '@startupjs/ui'
import { Popover } from '../popups'
import TooltipCaption from './Caption'
import STYLES from './index.styl'

// TODO: duration
function Tooltip ({
  children,
  style,
  tooltipStyle,
  placement,
  duration,
  content
}) {
  const [isVisible, setIsVisible] = useState(false)

  return pug`
    Popover(
      visible=isVisible
      hasArrow=true
      placement=placement || 'top-center'
      duration=300
      animateType='scale'
      wrapperStyle=[STYLES.wrapper, tooltipStyle]
      arrowStyleName='arrow'
      onDismiss=()=> setIsVisible(false)
      onRequestOpen=()=> setIsVisible(true)
    )
      Popover.Caption
        TooltipCaption(_onChange=v => setIsVisible(v))
          = children
      Span.text= content
  `
}

export default observer(Tooltip)
