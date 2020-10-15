import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../../typography/Span'
import Icon from './../../Icon'
import Row from './../../Row'
import Div from './../../Div'
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
          Span.title(numberOfLines=1)= children
        else
          = children
        if onDismiss
          Div.close(onPress=onDismiss)
            Icon.icon(icon=faTimes size='xl')
  `
}

ModalHeader.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(ModalHeader)
