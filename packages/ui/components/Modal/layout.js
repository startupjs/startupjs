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
  ModalElement,
  onCrossPress,
  dismissLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  onBackdropPress,
  $visible,
  showCross,
  enableBackdropPress
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

  const setVisibleFalse = () => $visible.set(false)

  // Handle <Modal.Content>
  content = content || (contentChildren.length > 0
    ? React.createElement(ModalContent, { variant }, contentChildren)
    : null)

  // Handle <Modal.Actions>
  const actionsProps = {
    dismissLabel,
    confirmLabel,
    onCancel: onCancel || setVisibleFalse,
    onConfirm: onConfirm || setVisibleFalse,
    style: content ? { paddingTop: 0 } : null
  }
  actions = actions
    ? React.cloneElement(actions, { ...actionsProps, ...actions.props })
    : onCancel || onConfirm
      ? React.createElement(ModalActions, actionsProps)
      : null

  // Handle <Modal.Header>
  const headerProps = {
    showCross,
    onCrossPress: onCrossPress || onCancel || setVisibleFalse,
    style: content || actions ? { paddingBottom: 0 } : null
  }
  header = header
    ? React.cloneElement(header, { ...headerProps, ...header.props })
    : title
      ? React.createElement(ModalHeader, headerProps, title)
      : React.createElement(ModalHeader, headerProps)

  const isWindowLayout = variant === 'window'

  return pug`
    View.root(style=style styleName=[variant])
      if isWindowLayout
        TouchableOpacity.overlay(
          activeOpacity=1
          onPress=onBackdropPress || onCancel || setVisibleFalse
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
