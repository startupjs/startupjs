import React, { useState, useEffect } from 'react'
import { Platform, View } from 'react-native'
import { pug, styl } from 'startupjs'
import AbstractPopover from '../AbstractPopover'
import Span from '../typography/Span'

const isWeb = Platform.OS === 'web'

const DEFAULT_TOOLTIP_PROPS = {
  position: 'top',
  attachment: 'center',
  arrow: true
}

export default function useTooltip ({ style, anchorRef, tooltip }) {
  const result = {}
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isWeb) return
    if (!tooltip) return

    function onClose () { setVisible(false) }

    window.addEventListener('wheel', onClose, true)
    return () => {
      window.removeEventListener('wheel', onClose, true)
    }
  }, [])

  if (tooltip) {
    result.tooltipElement = pug`
      AbstractPopover.tooltip(
        style=style
        anchorRef=anchorRef
        visible=visible
        ...DEFAULT_TOOLTIP_PROPS
      )
        //- case for DEPRECATED renderTooltip property
        if typeof tooltip === 'function'
          = tooltip()
        else
          //- HACK
          //- Wrap to row, because for small texts it does not correctly hyphenate in the text
          //- For example $500,000, Copy, etc...
          View(style={ flexDirection: 'row' })
            Span.tooltip-text= tooltip
    `
    const eventHandlers = {}

    if (isWeb) {
      eventHandlers.onMouseEnter = () => setVisible(true)
      eventHandlers.onMouseLeave = () => setVisible(false)
    } else {
      eventHandlers.onLongPress = () => setVisible(true)
      eventHandlers.onPressOut = () => setVisible(false)
    }

    result.tooltipEventHandlers = eventHandlers
  }

  return result

  styl`
    .tooltip
      background-color var(--Div-tooltipBg)
      max-width 260px
      radius()
      shadow(3)
      padding 1u 2u

      +tablet()
        max-width 320px

      &-text
        color var(--Div-tooltipText)
  `
}
