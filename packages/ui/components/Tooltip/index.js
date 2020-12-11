import React, { useState } from 'react'
import { Platform } from 'react-native'
import { observer, useComponentId } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../typography/Span'
import { Popover } from '../popups'
import TooltipCaption from './Caption'
import STYLES from './index.styl'

function Tooltip ({
  children,
  style,
  position,
  attachment,
  durationOpen,
  durationClose,
  content
}) {
  const componentId = useComponentId()
  const [isVisible, setIsVisible] = useState(false)

  return pug`
    Popover(
      visible=isVisible
      hasArrow=true
      hasCaptionInModal=false
      position=position
      attachment=attachment
      animateType='scale'
      backdropStyleName='backdrop'
      wrapperStyle=[STYLES.wrapper, style]
      arrowStyleName='arrow'
      durationOpen=durationOpen
      durationClose=durationClose
      onDismiss=()=> setIsVisible(false)
    )
      Popover.Caption
        TooltipCaption(
          componentId=componentId
          onChange=v=> setIsVisible(v)
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
  durationOpen: 300,
  durationClose: (Platform.OS === 'web') ? 0 : 100
}

Tooltip.propTypes = {
  tooltipStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number
}

export default observer(Tooltip)
