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

  const header = title
    ? React.createElement(ModalHeader, { onDismiss }, title)
    : childrenList
      .filter(child => child.type === ModalHeader)
      .map(child => React.cloneElement(child, { onDismiss }))

  const childsWithoutModalHeader = childrenList.filter(child => child.type !== ModalHeader)

  const contentChilds = []
  const actionsChilds = []
  childsWithoutModalHeader.forEach(child => {
    child.type === ModalActions ? actionsChilds.push(child) : contentChilds.push(child)
  })

  const actions = actionsChilds.length
    ? actionsChilds
      .filter(child => child.type === ModalActions)
      .map(child => React.cloneElement(
        child,
        {
          onDismiss: child.props.onDismiss || onDismiss,
          onConfirm: child.props.onConfirm || onConfirm
        }
      ))
    : React.createElement(ModalActions, { onDismiss, onConfirm })

  const areChildsHaveModalContent =
    useMemo(() => {
      return !!contentChilds.filter(child => child.type === ModalContent).length
    }, [contentChilds.length])

  const content = areChildsHaveModalContent
    ? contentChilds
    : React.createElement(ModalContent, null, contentChilds)

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
