import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Row from '../Row'
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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Tr)
