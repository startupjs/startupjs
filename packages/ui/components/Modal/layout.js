import React, { useMemo } from 'react'
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
  onDismiss,
  onConfirm,
  onBackdropPress
}) {
  let header, actions
  const contentChildren = []
  React.Children.forEach(children, child => {
    switch (child.type) {
      case ModalHeader:
        if (header) throw Error('[ui -> Modal] You must specify a single <Modal.Header>')
        header = child
        break
      case ModalActions:
        if (actions) throw Error('[ui -> Modal] You must specify a single <Modal.Actions>')
        actions = child
        break
      default:
        contentChildren.push(child)
    }
  })

  const doChildrenHaveModalContent =
    useMemo(() => {
      return !!contentChildren.filter(child => child.type === ModalContent).length
    }, [contentChildren.length])

  const content = doChildrenHaveModalContent
    ? contentChildren
    : contentChildren.length
      ? React.createElement(ModalContent, null, contentChildren)
      : null

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

  const headerProps = {
    onDismiss,
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
