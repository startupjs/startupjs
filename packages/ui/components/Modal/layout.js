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
  const childrenList = React.Children.toArray(children)
  const headerChildren = []
  const contentChildren = []
  const actionsChildren = []
  childrenList.forEach(child => {
    switch (child.type) {
      case ModalHeader:
        headerChildren.push(child)
        break
      case ModalActions:
        actionsChildren.push(child)
        break
      default:
        contentChildren.push(child)
    }
  })

  const areChildrenHaveModalContent =
    useMemo(() => {
      return !!contentChildren.filter(child => child.type === ModalContent).length
    }, [contentChildren.length])

  const content = areChildrenHaveModalContent
    ? contentChildren
    : contentChildren.length
      ? React.createElement(ModalContent, null, contentChildren)
      : null

  const actionsProps = {
    onDismiss,
    onConfirm,
    style: content ? { paddingTop: 0 } : null
  }
  const actions = actionsChildren.length
    ? actionsChildren
      .map(child => React.cloneElement(
        child,
        { ...actionsProps, ...child.props }
      ))
    : onDismiss || onConfirm
      ? React.createElement(ModalActions, actionsProps)
      : null

  const headerProps = {
    onDismiss,
    style: content || actions ? { paddingBottom: 0 } : null
  }
  const header = title
    ? React.createElement(ModalHeader, headerProps, title)
    : headerChildren.map(child => React.cloneElement(child, headerProps))

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
