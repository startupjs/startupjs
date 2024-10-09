import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../../typography/Span'
import ScrollView from './../../ScrollView'
import themed from '../../../theming/themed'
import './index.styl'

function ModalContent ({
  style,
  children,
  ContentComponent,
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

  const extraProps = {}

  // If no ContentComponent is provided, use ScrollView.
  // In this case, we merge extraProps with props to ensure all
  // additional properties are passed to the default ScrollView.
  if (!ContentComponent) {
    ContentComponent = ScrollView
    Object.assign(extraProps, props)
  }

  return pug`
    ContentComponent.root(
      style=style
      ...extraProps
    )= content
  `
}

ModalContent.defaultProps = {
}

ModalContent.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(themed('ModalContent', ModalContent))
