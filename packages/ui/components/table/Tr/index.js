import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Row from '../../Row'
import './index.styl'

function Tr ({ style, children, ...props }) {
  return pug`
    Row.root(
      ...props
      style=style
    )= children
  `
}

Tr.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(Tr)
