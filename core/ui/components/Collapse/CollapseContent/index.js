import React from 'react'
import Collapsible from 'react-native-collapsible'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import './index.styl'

function CollapseContent ({
  style,
  children,
  open, // @private
  variant, // @private
  ...props
}) {
  const content = React.Children.map(children, (child, index) => {
    if (typeof child === 'string') {
      return pug`
        Span= child
      `
    }
    return child
  })

  return pug`
    Collapsible.root(style=style styleName=[variant] collapsed=!open ...props)
      = content
  `
}

CollapseContent.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(themed('CollapseContent', CollapseContent))
