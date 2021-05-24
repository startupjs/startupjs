import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'
import ModalActions from './ModalActions'
import themed from '../../theming/themed'
import './index.styl'

function Modal ({
  style,
  modalStyle,
  children,
  variant,
  title,
  dismissLabel,
  cancelLabel,
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
  // DEPRECATED
  if (dismissLabel) {
    console.warn(
      '[@startupjs/ui] Modal: dismissLabel is DEPRECATED, use cancelLabel instead'
    )
    cancelLabel = dismissLabel
  }

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

  let _onConfirm
  let _onCancel

  if (onConfirm) {
    _onConfirm = async event => {
      event.persist() // TODO: remove in react 17
      const promise = onConfirm(event)
      if (promise?.then) await promise
      if (event.defaultPrevented) return
      closeFallback()
    }
  }

  if (onCancel || onConfirm) {
    if (!onConfirm && cancelLabel === ModalActions.defaultProps.cancelLabel) {
      cancelLabel = 'OK'
    }

    _onCancel = async event => {
      event.persist() // TODO: remove in react 17
      const promise = onCancel && onCancel(event)
      if (promise?.then) await promise
      if (event.defaultPrevented) return
      closeFallback()
    }
  }

  const _onCrossPress = async event => {
    event.persist() // TODO: remove in react 17
    const promise = onCrossPress && onCrossPress(event)
    if (promise?.then) await promise
    if (event.defaultPrevented) return
    closeFallback()
  }

  const _onBackdropPress = async event => {
    event.persist() // TODO: remove in react 17
    const promise = onBackdropPress && onBackdropPress(event)
    if (promise?.then) await promise
    if (event.defaultPrevented) return
    closeFallback()
  }

  // Handle <Modal.Actions>
  const actionsProps = {
    cancelLabel,
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
    onCrossPress: showCross ? _onCrossPress : undefined
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
          onPress=enableBackdropPress ? _onBackdropPress : undefined
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

export default observer(themed(Modal))
