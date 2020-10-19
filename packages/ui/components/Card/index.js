import React, { useMemo } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import './index.styl'
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  level: PropTypes.oneOf([0, 1, 2, 3, 4]),
  variant: PropTypes.oneOf(['elevated', 'outlined']),
  onPress: PropTypes.func
}

export default observer(Card)
