import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { ScrollView } from 'react-native'
import Span from './../../Typography/Span'
import './index.styl'

function ModalContent ({
  style,
  children,
  variant // @private
}) {
  const content = React.Children.map(children, (child, index) => {
    const key = `__MODAL_CONTENT_CHILDREN_KEY_${index}__`
    if (typeof child === 'string') {
      return pug`
        Span(key=key)= child
      `
    }
    return child
  })

  return pug`
    ScrollView.root(styleName=[variant])= content
  `
}

ModalContent.defaultProps = {
}

ModalContent.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(ModalContent)
