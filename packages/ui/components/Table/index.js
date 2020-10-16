import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Div from '../Div'
import './index.styl'

function Table ({ style, children, ...props }) {
  return pug`
    Div.root(
      ...props
      style=style
    )= children
  `
}

Table.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Table)
