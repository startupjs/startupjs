import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'
import './index.styl'

function Modal ({
  style,
  modalStyle,
  children,
  variant,
  title,
  dismissLabel,
  confirmLabel,
  ModalElement,
  showCross,
  enableBackdropPress,
  closeFallback,
  onCrossPress,
  onBackdropPress,
  onCancel,
  onConfirm
}) {
  // Deconstruct template variables
  let header, actions, content
  const contentChildren = []
  React.Children.forEach(children, child => {
    switch (child && child.type) {
      case ModalHeader:
        if (header) throw Error('[ui -> Modal] You must specify a single <Modal.Header>')
        header = child
        break
      case ModalActions:
        if (actions) throw Error('[ui -> Modal] You must specify a single <Modal.Actions>')
        actions = child
        break
      case ModalContent:
        if (content) throw Error('[ui -> Modal] You must specify a single <Modal.Content>')
        content = child
        break
      default:
        contentChildren.push(child)
    }
  })
  if (content && contentChildren.length > 0) {
    throw Error('[ui -> Modal] React elements found directly within <Modal>. ' +
      'If <Modal.Content> is specified, you have to put all your content inside it')
  }

  // Handle <Modal.Content>
  content = content || (contentChildren.length > 0
    ? React.createElement(ModalContent, { variant }, contentChildren)
    : null)

  const _onConfirm = async () => {
    const promise = onConfirm && onConfirm()
    if (promise.then) await promise
    closeFallback()
  }

  const _onCancel = async () => {
    const promise = onCancel && onCancel()
    if (promise.then) await promise
    closeFallback()
  }

  // Handle <Modal.Actions>
  const actionsProps = {
    dismissLabel,
    confirmLabel,
    style: content ? { paddingTop: 0 } : null,
    onCancel: _onCancel,
    onConfirm: _onConfirm
  }
  actions = actions
    ? React.cloneElement(actions, { ...actionsProps, ...actions.props })
    : onCancel || onConfirm
      ? React.createElement(ModalActions, actionsProps)
      : null

  // Handle <Modal.Header>
  const headerProps = {
    style: content || actions ? { paddingBottom: 0 } : null,
    onCrossPress: showCross ? onCrossPress || onCancel || closeFallback : undefined
  }
  header = header
    ? React.cloneElement(header, { ...headerProps, ...header.props })
    : title || showCross
      ? React.createElement(ModalHeader, headerProps, title)
      : null

  const isWindowLayout = variant === 'window'

  return pug`
    View.root(style=style styleName=[variant])
      if isWindowLayout
        TouchableOpacity.overlay(
          activeOpacity=1
          onPress=enableBackdropPress ? onBackdropPress || onCancel || closeFallback : undefined
        )
      ModalElement.modal(
        style=modalStyle
        styleName=[variant]
      )
        = header
        = content
        = actions
  `
}

export default observer(Modal)
