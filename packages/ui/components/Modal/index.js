import React, { useImperativeHandle, useLayoutEffect } from 'react'
import { SafeAreaView, Modal as RNModal } from 'react-native'
import { observer, useBind } from 'startupjs'
import PropTypes from 'prop-types'
import Layout from './layout'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'
import Portal from '../Portal'

function Modal ({
  style,
  modalStyle,
  visible,
  $visible,
  transparent,
  supportedOrientations,
  statusBarTranslucent,
  animationType,
  onChange,
  onDismiss,
  onRequestClose,
  onShow,
  onOrientationChange,
  ...props
}, ref) {
  ;({ visible, onChange } = useBind({ visible, $visible, onChange }))

  const _visible = !!visible

  function closeFallback () {
    onChange && onChange(false)
  }

  // TODO: This hack is used to make onDismiss work correctly.
  // Fix it when https://github.com/facebook/react-native/pull/29882 is released.
  // It fixed in 0.64
  useLayoutEffect(() => {
    if (!_visible) onDismiss && onDismiss()
  }, [visible])

  useImperativeHandle(ref, () => ({
    open: () => { onChange && onChange(true) },
    close: () => { onChange && onChange(false) }
  }), [])

  return pug`
    //- WORKAROUND
    //- we pass boolean value to visible property
    //- because modal window appears for undefined value
    RNModal(
      visible=_visible
      transparent=transparent
      supportedOrientations=supportedOrientations
      animationType=animationType
      statusBarTranslucent=statusBarTranslucent
      onRequestClose=onRequestClose
      onOrientationChange=onOrientationChange
      onShow=onShow
    )
      if _visible
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
  cancelLabel: ModalActions.defaultProps.cancelLabel,
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
  visible: PropTypes.bool,
  $visible: PropTypes.any,
  title: PropTypes.string,
  cancelLabel: ModalActions.propTypes.cancelLabel,
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
  onChange: PropTypes.func,
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
