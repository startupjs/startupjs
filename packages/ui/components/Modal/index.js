import React, { useImperativeHandle, useLayoutEffect } from 'react'
import { SafeAreaView, Modal as RNModal } from 'react-native'
import { observer, useOn, useValue, useIsMountedRef } from 'startupjs'
import PropTypes from 'prop-types'
import Layout from './layout'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'
import Portal from '../Portal'

function Modal ({
  style,
  modalStyle,
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
  const isMountedRef = useIsMountedRef()
  // eslint-disable-next-line camelcase
  const [_visible, $_visible] = useValue(false)

  useLayoutEffect(() => {
    if (!$visible) return
    $_visible.ref($visible)
    return () => $_visible.removeRef()
  }, [])

  function closeFallback () {
    $_visible.set(false)
  }

  // TODO: This hack is used to make onDismiss work correctly.
  // Fix it when https://github.com/facebook/react-native/pull/29882 is released.
  // It fixed in 0.64
  useOn('change', $_visible, () => {
    setTimeout(() => {
      if (!isMountedRef.current) return
      if (!$_visible.get()) onDismiss && onDismiss()
    }, 0)
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
    //- HACK: modal window appears when visible is undefined,
    //- make visible flag boolean
    RNModal(
      visible=!!_visible
      transparent=transparent
      supportedOrientations=supportedOrientations
      animationType=animationType
      statusBarTranslucent=statusBarTranslucent
      onRequestClose=onRequestClose
      onOrientationChange=onOrientationChange
      onShow=onShow
    )
      Portal.Provider
        Layout(
          style=style
          modalStyle=modalStyle
          closeFallback=closeFallback
          ...props
        )
  `
}

const ObservedModal = observer(Modal, { forwardRef: true })

ObservedModal.defaultProps = {
  variant: 'window',
  dismissLabel: ModalActions.defaultProps.dismissLabel,
  confirmLabel: ModalActions.defaultProps.confirmLabel,
  ModalElement: SafeAreaView,
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
  variant: PropTypes.oneOf(['window', 'fullscreen']),
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
