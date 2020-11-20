import React, { useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../typography/Span'
import { Popover } from '../popups'
import TooltipCaption from './Caption'
import STYLES from './index.styl'

function Tooltip ({
  children,
  tooltipStyle,
  position,
  attachment,
  durationOpen,
  durationClose,
  content
}) {
  const [isVisible, setIsVisible] = useState(false)

  function onChange (flag) {
    flag !== isVisible && setIsVisible(flag)
  }

  return pug`
    Popover(
      visible=isVisible
      hasArrow=true
      position=position
      attachment=attachment
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
        TooltipCaption(
          onChange=onChange
        )= children
      if typeof content === 'string'
        Span.text= content
      else
        = content
  `
}

Tooltip.defaultProps = {
  position: 'top',
  attachment: 'center',
  durationOpen: 200,
  durationClose: 0
}

Tooltip.propTypes = {
  tooltipStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number
}

export default observer(Tooltip)
