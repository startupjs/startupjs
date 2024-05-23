import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import Span from './../../typography/Span'
import Icon from './../../Icon'
import Div from './../../Div'
import themed from '../../../theming/themed'
import './index.styl'

function ModalHeader ({
  style,
  children,
  onCrossPress // @private
}) {
  return pug`
    Div.root(row style=style styleName=children ? 'between' : 'right' vAlign='center')
      if typeof children === 'string'
        Span.title(numberOfLines=1)= children
      else
        = children
      if onCrossPress
        Div.close(onPress=onCrossPress)
          Icon.icon(icon=faTimes size='xl')
  `
}

ModalHeader.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  onCrossPress: PropTypes.func
}

export default observer(themed('ModalHeader', ModalHeader))
