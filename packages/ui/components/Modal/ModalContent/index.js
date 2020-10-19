import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { ScrollView } from 'react-native'
import Span from './../../typography/Span'
import './index.styl'

function ModalContent ({
  style,
  children,
  ContentComponent = ScrollView,
  variant // @private
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
    ContentComponent.root(styleName=[variant])= content
  `
}

ModalContent.defaultProps = {
}

ModalContent.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(ModalContent)
