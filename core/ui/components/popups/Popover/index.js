import React, { useMemo, useRef, useImperativeHandle } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { pug, observer, useBind, $ } from 'startupjs'
import PropTypes from 'prop-types'
import AbstractPopover from './../../AbstractPopover'
import DeprecatedPopover from './Deprecated'
import Div from '../../Div'
import './index.styl'

const _Popover = observer((props, ref) => {
  const { children } = props

  if (children && children[0]?.type?.name === DeprecatedPopover.Caption.name) {
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
  visible,
  $visible,
  children,
  renderContent,
  onChange,
  overlayStyle,
  ...props
}, ref) => {
  const anchorRef = useRef()

  const isUncontrolled = useMemo(() => {
    const isUsedViaTwoWayDataBinding = typeof $visible !== 'undefined'
    const isUsedViaState = typeof onChange === 'function'
    return !(isUsedViaTwoWayDataBinding || isUsedViaState)
  }, [])

  if (isUncontrolled) {
    useImperativeHandle(ref, () => ({
      open: () => $visible.setDiff(true),
      close: () => $visible.setDiff(false)
    }))
    $visible = $(false)
  }

  ;({ visible, onChange } = useBind({ visible, $visible, onChange }))

  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> onChange(false))
          View.overlay(style=overlayStyle)
        = children
    `
  }

  return pug`
    Div(
      style=style
      ref=anchorRef
      onPress=isUncontrolled ? null : (()=> onChange(true))
    )= children
    AbstractPopover.attachment(
      ...props
      visible=visible
      style=[attachmentStyle]
      anchorRef=anchorRef
      renderWrapper=renderWrapper
    )= renderContent && renderContent()
  `
}, { forwardRef: true })

_Popover.Caption = DeprecatedPopover.Caption

_Popover.defaultProps = AbstractPopover.defaultProps
_Popover.propTypes = {
  attachmentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ...AbstractPopover.propTypes,
  $visible: PropTypes.any,
  onChange: PropTypes.func
}

export default _Popover
