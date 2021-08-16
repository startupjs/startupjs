import React, { useRef } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import AbstractPopover from './AbstractPopover'
import DeprecatedPopover from './Deprecated'
import Div from '../../Div'
import './index.styl'

function _Popover (props) {
  const { children } = props

  if (children[0]?.type?.name === DeprecatedPopover.Caption.name) {
    console.warn('[@startupjs/ui] Popover: Popover.Caption is DEPRECATED, use new api')

    return pug`
      DeprecatedPopover(...props)
    `
  }

  return pug`
    Popover(...props)
  `
}

function Popover ({
  style,
  attachmentStyle,
  children,
  renderContent,
  ...props
}) {
  const popoverRef = useRef()
  const refAnchor = useRef()

  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> popoverRef.current.close())
          View.overlay
        = children
    `
  }

  return pug`
    Div(
      style=style
      ref=refAnchor
      onPress=()=> popoverRef.current.open()
    )= children
    AbstractPopover.attachment(
      ...props
      ref=popoverRef
      style=[attachmentStyle]
      refAnchor=refAnchor
      renderWrapper=renderWrapper
    )= renderContent()
  `
}

_Popover.Caption = DeprecatedPopover.Caption

_Popover.defaultProps = AbstractPopover.defaultProps
_Popover.propTypes = {
  attachmentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ...AbstractPopover.propTypes
}

export default _Popover
