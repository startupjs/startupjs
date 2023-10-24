import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Row from '../../Row'
import themed from '../../../theming/themed'

function Tr ({ style, children, ...props }) {
  return pug`
    Row(
      ...props
      style=style
    )= children
  `
}

Tr.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(themed('Tr', Tr))
