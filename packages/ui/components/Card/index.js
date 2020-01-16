import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import shadows from '../Div/shadows'
import './index.styl'

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
  level: propTypes.oneOf(Object.keys(shadows).map(k => +k))
}

Card.defaultProps = {
  level: 0
}

export default observer(Card)
