import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { pug, observer } from 'startupjs'
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
  onRequestClose,
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
    if (!child) return

    switch (child.type) {
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

  let _onConfirm
  let _onCancel
  const isWindowLayout = variant === 'window'

  const _onCrossPress = async event => {
    event.persist() // TODO: remove in react 17
    const promise = onCrossPress && onCrossPress(event)
    if (promise?.then) await promise
    if (event.defaultPrevented) return
    onRequestClose()
  }

  const _onBackdropPress = async event => {
    event.persist() // TODO: remove in react 17
    const promise = onBackdropPress && onBackdropPress(event)
    if (promise?.then) await promise
    if (event.defaultPrevented) return
    onRequestClose()
  }

  if (onConfirm) {
    _onConfirm = async event => {
      event.persist() // TODO: remove in react 17
      const promise = onConfirm(event)
      if (promise?.then) await promise
      if (event.defaultPrevented) return
      onRequestClose()
    }
  }

  if (onCancel || onConfirm) {
    _onCancel = async event => {
      event.persist() // TODO: remove in react 17
      const promise = onCancel && onCancel(event)
      if (promise?.then) await promise
      if (event.defaultPrevented) return
      onRequestClose()
    }
  }

  if (!onConfirm && cancelLabel === ModalActions.defaultProps.cancelLabel) {
    cancelLabel = 'OK'
  }

  // Handle <Modal.Header>
  const headerProps = {
    onCrossPress: showCross ? _onCrossPress : undefined
  }

  header = header
    ? React.cloneElement(header, { ...headerProps, ...header.props })
    : title || showCross
      ? React.createElement(ModalHeader, headerProps, title)
      : null

  // Handle <Modal.Actions>
  const actionsProps = {
    cancelLabel,
    confirmLabel,
    onCancel: _onCancel,
    onConfirm: _onConfirm
  }

  actions = actions
    ? React.cloneElement(actions, { ...actionsProps, ...actions.props })
    : onCancel || onConfirm
      ? React.createElement(ModalActions, actionsProps)
      : null

  // Handle <Modal.Content>
  const contentStyle = {}

  if (header) contentStyle.paddingTop = 0
  if (actions) contentStyle.paddingBottom = 0

  const contentProps = { variant, style: contentStyle }

  // content part should always present
  content = content
    ? React.cloneElement(content, { ...contentProps, ...content.props })
    : React.createElement(ModalContent, contentProps, contentChildren)

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

export default observer(themed('Modal', Modal))
