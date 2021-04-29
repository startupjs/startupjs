import React, { useState } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'
import DeprecatedPopover from './deprecated'
import { PLACEMENTS_ORDER } from './constants.json'

function Popover ({
  children,
  style,
  arrowStyle,
  captionStyle, // DEPRECATED
  contentStyle,
  renderContent,
  visible, // DEPRECATED
  position,
  attachment,
  placements,
  animateType,
  durationOpen,
  durationClose,
  hasArrow,
  hasWidthCaption,
  hasOverlay, // DEPRECATED
  hasDefaultWrapper, // DEPRECATED
  onDismiss,
  onRequestOpen,
  onRequestClose
}, ref) {
  const [_visible, setVisible] = useState(false)

  if (children[0] && children[0].type.name === PopoverCaption.name) {
    console.warn('[@startupjs/ui] Popover: Popover.Caption is DEPRECATED, use new api')

    return pug`
      DeprecatedPopover(
        style=style
        arrowStyle=arrowStyle
        captionStyle=captionStyle
        visible=visible
        position=position
        attachment=attachment
        animateType=animateType
        durationOpen=durationOpen
        durationClose=durationClose
        hasArrow=hasArrow
        hasOverlay=hasOverlay
        hasWidthCaption=hasWidthCaption
        hasDefaultWrapper=hasDefaultWrapper
        onDismiss=onDismiss
        onRequestOpen=onRequestOpen
        onRequestClose=onRequestClose
      )= children
    `
  }

  function renderTooltipWrapper ({ children }) {
    return pug`
      View.wrapper
        TouchableWithoutFeedback(onPress=() => setVisible(false))
          View.overlay
        = children
    `
  }

  return pug`
    Div(
      style=style
      tooltipProps={
        contentStyle,
        animateType,
        durationOpen,
        durationClose,
        position,
        attachment,
        hasArrow,
        hasWidthCaption,
        onDismiss: ()=> setVisible(false),
        onRequestOpen,
        onRequestClose
      }
      _showTooltip=_visible
      renderTooltip=renderContent
      renderTooltipWrapper=renderTooltipWrapper
      onPress=()=> setVisible(true)
    )= children
  `
}

const PopoverCaption = ({ children }) => children // DEPRECATED

const ObservedPopover = observer(Popover, { forwardRef: true })
ObservedPopover.Caption = PopoverCaption // DEPRECATED

ObservedPopover.defaultProps = {
  position: 'bottom',
  attachment: 'start',
  placements: PLACEMENTS_ORDER,
  animateType: 'opacity',
  hasWidthCaption: false,
  hasArrow: false,
  hasOverlay: true,
  hasDefaultWrapper: true,
  durationOpen: 300,
  durationClose: 200
}

ObservedPopover.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  arrowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  animateType: PropTypes.oneOf(['opacity', 'scale']),
  hasWidthCaption: PropTypes.bool,
  hasArrow: PropTypes.bool,
  hasOverlay: PropTypes.bool,
  hasInsideScroll: PropTypes.bool,
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number,
  onDismiss: PropTypes.func,
  onRequestOpen: PropTypes.func,
  onRequestClose: PropTypes.func
}

export default ObservedPopover
