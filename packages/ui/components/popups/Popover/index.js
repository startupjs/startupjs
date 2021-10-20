import React, { useMemo, useRef, useImperativeHandle } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { observer, useBind, useValue } from 'startupjs'
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
  ...props
}, ref) => {
  const refAnchor = useRef()

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
    ;[, $visible] = useValue(false)
  }

  ;({ visible, onChange } = useBind({ visible, $visible, onChange }))

  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=()=> onChange(false))
          View.overlay
        = children
    `
  }

  return pug`
    Div(
      style=style
      ref=refAnchor
      onPress=()=> onChange(true)
    )= children
    AbstractPopover.attachment(
      ...props
      visible=visible
      style=[attachmentStyle]
      refAnchor=refAnchor
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
