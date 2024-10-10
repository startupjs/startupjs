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

  if (!ContentComponent) ContentComponent = ScrollView

  return pug`
    ContentComponent.root(
      style=style
      ...props
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
