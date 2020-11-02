import React, { useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { Span } from '@startupjs/ui'
import { Popover } from '../popups'
import TooltipCaption from './Caption'
import { PLACEMENT_ORDER } from '../popups/Popover/constants.json'
import STYLES from './index.styl'

function Tooltip ({
  children,
  style,
  tooltipStyle,
  placement,
  durationOpen,
  durationClose,
  content
}) {
  const [isVisible, setIsVisible] = useState(false)

  return pug`
    Popover(
      visible=isVisible
      hasArrow=true
      placement=placement
      animateType='scale'
      wrapperStyle=[STYLES.wrapper, tooltipStyle]
      arrowStyleName='arrow'
      durationOpen=durationOpen
      durationClose=durationClose
      onDismiss=()=> setIsVisible(false)
      onOverlayMouseMove=()=> setIsVisible(false)
      onRequestOpen=()=> setIsVisible(true)
    )
      Popover.Caption
        TooltipCaption(onChange=v => setIsVisible(v))
          = children
      if typeof content === 'string'
        Span.text= content
      else
        = content
  `
}

Popover.defaultProps = {
  placement: 'top-center',
  durationOpen: 200,
  durationClose: 0
}

Popover.propTypes = {
  tooltipStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placement: PropTypes.oneOf(PLACEMENT_ORDER),
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number
}

export default observer(Tooltip)
