import React, { useRef } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import AbstractPopover from './AbstractPopover'
import DeprecatedPopover from './Deprecated'
import Div from '../../Div'
import './index.styl'

const _Popover = observer((props, ref) => {
  const { children } = props

  if (children[0]?.type?.name === DeprecatedPopover.Caption.name) {
    console.warn('[@startupjs/ui] Popover: Popover.Caption is DEPRECATED, use new api')

    return pug`
      DeprecatedPopover(...props ref=ref)
    `
  }

  return pug`
    Popover(...props ref=ref)
  `
}, { forwardRef: true })

const Popover = observer(({
  style,
  attachmentStyle,
  children,
  renderContent,
  ...props
}, ref) => {
  const popoverRef = ref || useRef()
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
}, { forwardRef: true })

_Popover.Caption = DeprecatedPopover.Caption

_Popover.defaultProps = AbstractPopover.defaultProps
_Popover.propTypes = {
  attachmentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ...AbstractPopover.propTypes
}

export default _Popover
