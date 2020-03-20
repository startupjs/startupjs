import React from 'react'
import { observer } from 'startupjs'
import Span from './../../Span'
import Icon from './../../Icon'
import Row from './../../Row'
import Div from './../../Div'
import propTypes from 'prop-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import config from './../../../config/rootConfig'
import './index.styl'

const { colors } = config

function ModalHeader ({
  style,
  children,
  onDismiss // @private
}) {
  const childs = React.Children.toArray(children).map(child => {
    if (typeof child === 'string') {
      return pug`
        Span.title(
          key='__MODAL_HEADER_KEY__'
          size='xl'
          numberOfLines=1
          bold
        )= child
      `
    }
    return child
  })

  return pug`
    if childs.length || onDismiss
      Row.root(style=style align='between' vAlign='center')
        = childs
        if onDismiss
          Div(onPress=onDismiss)
            Icon(icon=faTimes size='l' color=colors.dark)
  `
}

ModalHeader.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(ModalHeader)
