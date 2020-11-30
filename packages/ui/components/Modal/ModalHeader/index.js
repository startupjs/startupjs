import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Span from './../../typography/Span'
import Icon from './../../Icon'
import Row from './../../Row'
import Div from './../../Div'
import './index.styl'

function ModalHeader ({
  style,
  children,
  showCross,
  onClose // @private
}) {
  return pug`
    if children
      Row.root(style=style align='between' vAlign='center')
        if typeof children === 'string'
          Span.title(numberOfLines=1)= children
        else
          = children
        if showCross
          Div.close(onPress=onClose)
            Icon.icon(icon=faTimes size='xl')
  `
}

ModalHeader.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  showCross: PropTypes.bool,
  children: PropTypes.node
}

export default observer(ModalHeader)
