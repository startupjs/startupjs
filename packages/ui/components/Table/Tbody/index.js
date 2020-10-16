import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../../Div'

function Tbody ({ style, children, ...props }) {
  return pug`
    Div(
      ...props
      style=style
    )= children
  `
}

Tbody.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(Tbody)
