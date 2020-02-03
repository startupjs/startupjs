import React from 'react'
import { observer } from 'startupjs'
import { ScrollView, View, TouchableOpacity } from 'react-native'
import Span from './../Span'
import Icon from './../Icon'
import Row from './../Row'
import Div from './../Div'
import Actions from './actions'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import config from './../../config/rootConfig'
import './index.styl'

function Modal ({
  style,
  modalStyle,
  children,
  title,
  ModalElement,
  onDismiss,
  onBackdropPress
}) {
  const childrenList = React.Children.toArray(children)
  const content = childrenList.filter(child => child.type !== Actions)
  const actions = childrenList.filter(child => child.type === Actions)

  return pug`
    View.root(style=style)
      TouchableOpacity.overlay(
        activeOpacity=1
        onPress=onBackdropPress || onDismiss
      )
      ModalElement.modal(style=[config.shadows[4], modalStyle])
        if title || onDismiss
          Row.title(align='between' vAlign='center')
            if title
              Span.titleText(size='xl' numberOfLines=1 bold)= title
            if onDismiss
              Div(onPress=onDismiss)
                Icon(icon=faTimes color=config.colors.dark)
        ScrollView.content= content
        if actions.length
          = actions
  `
}

export default observer(Modal)
