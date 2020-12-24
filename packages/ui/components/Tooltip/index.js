import React, { useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Popover from '../popups/Popover'
import TooltipCaption from './Caption'
import Span from '../typography/Span'
import './index.styl'

function Tooltip ({
  children,
  style,
  contentStyle,
  position,
  attachment,
  durationOpen,
  durationClose,
  content
}) {
  const [isShow, setIsShow] = useState(false)

  return pug`
    Popover(
      visible=isShow
      arrowStyleName='arrow'
      contentStyleName='content'
      contentStyle=contentStyle
      position='top'
      attachment='center'
      animateType='scale'
      durationOpen=durationOpen
      durationClose=durationClose
      hasArrow=true
      hasOverlay=false
      onDismiss=()=> setIsShow(false)
    )
      Popover.Caption(style=style)
        TooltipCaption(onChange=v=> setIsShow(v))
          = children
      if typeof content === 'string'
        Span.text= content
      else
        = content
  `
}

Tooltip.defaultProps = {
  position: 'top',
  attachment: 'center',
  durationOpen: 300,
  durationClose: 100
}

Tooltip.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number
}

export default observer(Tooltip)
