import React from 'react'
import { View, Modal as RNModal } from 'react-native'
import { observer, useBind, useOn } from 'startupjs'
import PropTypes from 'prop-types'
import Layout from './layout'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'

function Modal ({
  style,
  $visible,
  transparent,
  supportedOrientations,
  statusBarTranslucent,
  animationType,
  onDismiss,
  onRequestClose,
  onShow,
  onOrientationChange,
  ...props
}) {
  let visible
  let onChangeVisible
  ;({ visible, onChangeVisible } = useBind({ $visible, visible, onChangeVisible }))

  function closeFallback () {
    onChangeVisible(false)
  }

  // TODO: This hack is used to make onDismiss work correctly.
  // Fix it when https://github.com/facebook/react-native/pull/29882 is released.
  useOn('change', $visible, () => {
    if (!$visible.get()) onDismiss && onDismiss()
  })

  return pug`
    RNModal(
      style=style
      visible=visible
      transparent=transparent
      supportedOrientations=supportedOrientations
      animationType=animationType
      statusBarTranslucent=statusBarTranslucent
      onRequestClose=onRequestClose
      onOrientationChange=onOrientationChange
      onShow=onShow
    )
      if props.variant !== 'custom'
        Layout(
          modalStyle=style
          $visible=$visible
          closeFallback=closeFallback
          ...props
        )
      else
        = props.children
  `
}

Modal.defaultProps = {
  visible: false,
  variant: 'window',
  dismissLabel: ModalActions.defaultProps.dismissLabel,
  confirmLabel: ModalActions.defaultProps.confirmLabel,
  ModalElement: View,
  animationType: 'fade',
  transparent: true,
  showCross: true,
  enableBackdropPress: true,
  supportedOrientations: ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'],
  onRequestClose: () => {} // required prop in some platforms
}

Modal.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['window', 'fullscreen', 'custom']),
  $visible: PropTypes.any,
  title: PropTypes.string,
  dismissLabel: ModalActions.propTypes.dismissLabel,
  confirmLabel: ModalActions.propTypes.confirmLabel,
  showCross: PropTypes.bool,
  enableBackdropPress: PropTypes.bool,
  ModalElement: PropTypes.any,
  animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
  transparent: PropTypes.bool,
  statusBarTranslucent: PropTypes.bool,
  supportedOrientations: PropTypes.arrayOf(PropTypes.oneOf([
    'portrait',
    'portrait-upside-down',
    'landscape',
    'landscape-left',
    'landscape-right'
  ])),
  onShow: PropTypes.func,
  onCrossPress: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onBackdropPress: PropTypes.func,
  onOrientationChange: PropTypes.func,
  onRequestClose: PropTypes.func,
  onDismiss: PropTypes.func
}

const ObservedModal = observer(Modal)
ObservedModal.Header = ModalHeader
ObservedModal.Content = ModalContent
ObservedModal.Actions = ModalActions

export default ObservedModal
