import React from 'react'
import { observer } from 'startupjs'
import { View, TouchableOpacity } from 'react-native'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'
import config from './../../config/rootConfig'
import './index.styl'

function Modal ({
  style,
  modalStyle,
  children,
  variant,
  title,
  ModalElement,
  onCrossPress,
  onDismiss,
  onConfirm,
  onBackdropPress
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

  // Handle <Modal.Actions>
  const actionsProps = {
    onDismiss,
    onConfirm,
    style: content ? { paddingTop: 0 } : null
  }
  actions = actions
    ? React.cloneElement(actions, { ...actionsProps, ...actions.props })
    : onDismiss || onConfirm
      ? React.createElement(ModalActions, actionsProps)
      : null

  // Handle <Modal.Header>
  const headerProps = {
    onDismiss: onCrossPress || onDismiss,
    style: content || actions ? { paddingBottom: 0 } : null
  }
  header = header
    ? React.cloneElement(header, { ...headerProps, ...header.props })
    : title
      ? React.createElement(ModalHeader, headerProps, title)
      : null

  const isWindowLayout = variant === 'window'

  return pug`
    View.root(style=style styleName=[variant])
      if isWindowLayout
        TouchableOpacity.overlay(
          activeOpacity=1
          onPress=onBackdropPress || onDismiss
        )
      ModalElement.modal(
        style=[isWindowLayout ? config.shadows[4] : {}, modalStyle]
        styleName=[variant]
      )
        = header
        = content
        = actions
  `
}

export default observer(Modal)
