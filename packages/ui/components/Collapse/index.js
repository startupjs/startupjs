import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import { View } from 'react-native'
import Span from './../Span'
import Row from './../Row'
import Icon from './../Icon'
import Collapsible from 'react-native-collapsible'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import config from './../../config/rootConfig'
import './index.styl'

function Collapse ({ style, title, open, children }) {
  return pug`
    View.root(style=style)
      Row.title(align='between' vAlign='center')
        Span.titleText(size='l' numberOfLines=1 bold)= title
        Icon(icon=faCaretDown color=config.colors.dark)
      Collapsible(collapsed=!open)
        View.content= children
  `
}

Collapse.defaultProps = {
  open: false
}

Collapse.propTypes = {
  style: propTypes.object,
  children: propTypes.node.isRequired,
  title: propTypes.string.isRequired,
  open: propTypes.bool
}

export default observer(Collapse)
