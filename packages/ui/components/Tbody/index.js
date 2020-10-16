import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Div from '../Div'

function Tbody ({ style, children, ...props }) {
  return pug`
    Div(
      ...props
      style=style
    )= children
  `
}

Tbody.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Tbody)
