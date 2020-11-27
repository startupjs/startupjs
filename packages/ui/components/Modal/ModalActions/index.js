import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Row from './../../Row'
import Button from './../../Button'
import './index.styl'

function ModalActions ({
  style,
  children,
  dismissLabel,
  confirmLabel,
  onClose,
  onConfirm
}) {
  return pug`
    Row.root(style=style align='right')
      if children
        = children
      else
        if onClose
          Button.action(
            color='primary'
            onPress=onClose
          )= dismissLabel
        if onConfirm
          Button.action(
            color='primary'
            variant='flat'
            onPress=onConfirm
          )= confirmLabel

  `
}

ModalActions.defaultProps = {
  dismissLabel: 'Cancel',
  confirmLabel: 'Confirm'
}

ModalActions.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  dismissLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func
}

export default observer(ModalActions)
