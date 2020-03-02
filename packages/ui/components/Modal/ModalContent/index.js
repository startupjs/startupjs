import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { ScrollView } from 'react-native'
import './index.styl'

function ModalContent ({
  style,
  children
}) {
  return pug`
    ScrollView.root= children
  `
}

ModalContent.defaultProps = {
}

ModalContent.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(ModalContent)
