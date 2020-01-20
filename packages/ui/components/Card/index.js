import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import config from '../../config/rootConfig'
import './index.styl'

const SHADOWS = config.shadows

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

Card.propTypes = {
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

Card.defaultProps = {
  level: 0
}

export default observer(Card)
