import React from 'react'
import { View, Modal as RNModal } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Layout from './layout'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'

function Modal ({
  style,
  visible,
  onOrientationChange,
  supportedOrientations,
  animationType,
  onDismiss,
  onRequestClose,
  onShow,
  statusBarTranslucent,
  ...props
}) {
  if (!visible) return null

  if (props.variant === 'custom') {
    return pug`
      RNModal(
        style=style
        visible
        transparent
        animationType=animationType
        onRequestClose=onRequestClose
        onOrientationChange=onOrientationChange
        supportedOrientations=supportedOrientations
        onDismiss=onDismiss
        onShow=onShow
        statusBarTranslucent=statusBarTranslucent
      )= props.children
    `
  }

  return pug`
    RNModal(
      visible
      transparent
      animationType=animationType
      onRequestClose=onRequestClose
      onOrientationChange=onOrientationChange
      supportedOrientations=supportedOrientations
      onDismiss=onDismiss
      onShow=onShow
      statusBarTranslucent=statusBarTranslucent
    )
      Layout(
        modalStyle=style
        ...props
      )
  `
}

Modal.defaultProps = {
  visible: false,
  variant: 'window',
  dismissLabel: ModalActions.defaultProps.dismissLabel,
  confirmLabel: ModalActions.defaultProps.confirmLabel,
  ModalElement: View,
  animationType: 'fade',
  transparent: false,
  showCross: true,
  supportedOrientations: ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']
}

Modal.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['window', 'fullscreen', 'custom']),
  visible: PropTypes.bool,
  $visible: PropTypes.any,
  title: PropTypes.string,
  dismissLabel: ModalActions.propTypes.dismissLabel,
  confirmLabel: ModalActions.propTypes.confirmLabel,
  showCross: PropTypes.bool,
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
  onClose: PropTypes.func,
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
