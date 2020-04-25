import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { ScrollView } from 'react-native'
import './index.styl'

function ModalContent ({
  style,
  variant,
  children
}) {
  return pug`
    ScrollView.root(
      styleName=variant
      contentContainerStyle=variant === 'pure' ? { flex: 1 } : {}
    )= children
  `
}

ModalContent.defaultProps = {
}

ModalContent.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(ModalContent)
