import React from 'react'
import { observer } from 'startupjs'
import Span from './../../Typography/Span'
import Icon from './../../Icon'
import Row from './../../Row'
import Div from './../../Div'
import propTypes from 'prop-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

function ModalHeader ({
  style,
  children,
  onDismiss // @private
}) {
  return pug`
    if children || onDismiss
      Row.root(style=style align='between' vAlign='center')
        if typeof children === 'string'
          Span(size='xl' numberOfLines=1 bold)= children
        else
          = children
        if onDismiss
          Div(onPress=onDismiss)
            Icon(icon=faTimes size='xl' color='dark')
  `
}

ModalHeader.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(ModalHeader)
