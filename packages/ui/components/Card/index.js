import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import config from '../../config/rootConfig'
import './index.styl'

const SHADOWS = config.shadows

// TODO: hover, active states
function Card ({
  style,
  level,
  children,
  onPress
}) {
  return pug`
    Div.root(
      style=style
      level=level
      onPress=onPress
    )
      = children
  `
}

Card.defaultProps = {
  level: 1
}

Card.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index).slice(1)),
  onPress: propTypes.func
}

export default observer(Card)
