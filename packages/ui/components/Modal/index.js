import React, { useImperativeHandle, useLayoutEffect } from 'react'
import { View, Modal as RNModal } from 'react-native'
import { observer, useOn, useValue } from 'startupjs'
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
}, ref) {
  // eslint-disable-next-line camelcase
  const [_visible, $_visible] = useValue(false)

  useLayoutEffect(() => {
    if (!$visible) return
    $_visible.ref($visible)
    return () => $visible.removeRef($_visible)
  }, [])

  function closeFallback () {
    $_visible.set(false)
  }

  // TODO: This hack is used to make onDismiss work correctly.
  // Fix it when https://github.com/facebook/react-native/pull/29882 is released.
  useOn('change', $_visible, () => {
    if (!$_visible.get()) onDismiss && onDismiss()
  })

  useImperativeHandle(ref, () => ({
    open: () => {
      $_visible.set(true)
    },
    close: () => {
      $_visible.set(false)
    }
  }))

  return pug`
    RNModal(
      style=style
      visible=_visible
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
          closeFallback=closeFallback
          ...props
        )
      else
        = props.children
  `
}
const ObservedModal = observer(Modal, { forwardRef: true })

ObservedModal.defaultProps = {
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

ObservedModal.propTypes = {
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

ObservedModal.Header = ModalHeader
ObservedModal.Content = ModalContent
ObservedModal.Actions = ModalActions

export default ObservedModal
