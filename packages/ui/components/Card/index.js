import React, { useMemo } from 'react'
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
  variant,
  onPress,
  ...props
}) {
  const extraProps = useMemo(() => {
    let props = {}
    if (variant === 'elevated') props.level = level
    return props
  }, [variant, level])

  return pug`
    Div.root(
      style=style
      styleName=[variant]
      onPress=onPress
      ...props
      ...extraProps
    )
      = children
  `
}

Card.defaultProps = {
  level: 1,
  variant: 'elevated'
}

Card.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index).slice(1)),
  variant: propTypes.oneOf(['elevated', 'outlined']),
  onPress: propTypes.func
}

export default observer(Card)
