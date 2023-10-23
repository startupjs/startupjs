import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Row from './../../Row'
import Button from './../../Button'
import themed from '../../../theming/themed'
import './index.styl'

function ModalActions ({
  style,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm
}) {
  return pug`
    Row.root(style=style align='right')
      if children
        = children
      else
        if onCancel
          Button.action(
            color='primary'
            onPress=onCancel
          )= cancelLabel
        if onConfirm
          Button.action(
            color='primary'
            variant='flat'
            onPress=onConfirm
          )= confirmLabel
  `
}

ModalActions.defaultProps = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm'
}

ModalActions.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}

export default observer(themed('ModalActions', ModalActions))
