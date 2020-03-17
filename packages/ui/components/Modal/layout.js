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
  const headerChilds = []
  const contentChilds = []
  const actionsChilds = []
  childrenList.forEach(child => {
    switch (child.type) {
      case ModalHeader:
        headerChilds.push(child)
        break
      case ModalActions:
        actionsChilds.push(child)
        break
      default:
        contentChilds.push(child)
    }
  })

  const areChildsHaveModalContent =
    useMemo(() => {
      return !!contentChilds.filter(child => child.type === ModalContent).length
    }, [contentChilds.length])

  const content = areChildsHaveModalContent
    ? contentChilds
    : contentChilds.length
      ? React.createElement(ModalContent, null, contentChilds)
      : null

  const actionsProps = {
    onDismiss,
    onConfirm,
    style: content ? { paddingTop: 0 } : null
  }
  const actions = actionsChilds.length
    ? actionsChilds
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
    : headerChilds.map(child => React.cloneElement(child, headerProps))

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
