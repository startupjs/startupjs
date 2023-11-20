import React, { useEffect } from 'react'
import { pug, observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import Popover from '../popups/Popover'
import TooltipCaption from './Caption'
import Div from '../Div'
import Span from '../typography/Span'
import './index.styl'

function DeprecatedTooltip ({
  children,
  style,
  contentStyle,
  position,
  attachment,
  durationOpen,
  durationClose,
  content
}) {
  console.warn('[@startupjs/ui] Tooltip: is DEPRECATED, Div with renderTooltip prop')

  const [isShow, $isShow] = useValue(false)

  useEffect(() => () => $isShow.del(), [])

  return pug`
    Popover(
      visible=isShow
      arrowStyleName='arrow'
      position='top'
      attachment='center'
      animateType='scale'
      durationOpen=durationOpen
      durationClose=durationClose
      hasArrow=true
      hasOverlay=false
      hasDefaultWrapper=false
      onDismiss= ()=> $isShow.setDiff(false)
    )
      Popover.Caption(style=style)
        TooltipCaption(onChange= v=> $isShow.setDiff(v))
          = children
      Div.content(style=contentStyle)
        if typeof content === 'string'
          Span.text= content
        else
          = content
  `
}

DeprecatedTooltip.defaultProps = {
  position: 'top',
  attachment: 'center',
  durationOpen: 300,
  durationClose: 100
}

DeprecatedTooltip.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number
}

export default observer(DeprecatedTooltip)
