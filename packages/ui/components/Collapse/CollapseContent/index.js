import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import Span from './../../Span'
import propTypes from 'prop-types'
import './index.styl'

function CollapseContent ({
  style,
  children,
  open, // @private
  variant // @private
}) {
  const content = React.Children.toArray(children).map((child, index) => {
    const key = `__COLLAPSE_CONTENT_KEY_${index}__`
    if (typeof child === 'string') {
      return pug`
        Span(key=key)= child
      `
    }
    return child
  })
  return pug`
    Collapsible(collapsed=!open)
      View.root(style=style styleName=[variant])
        = content
  `
}

CollapseContent.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(CollapseContent)
