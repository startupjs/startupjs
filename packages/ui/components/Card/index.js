import React, { useMemo } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { shadows: SHADOWS } = STYLES
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
    const props = {}
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
  level: PropTypes.oneOf(Object.keys(SHADOWS).map(i => ~~i)),
  variant: PropTypes.oneOf(['elevated', 'outlined']),
  onPress: PropTypes.func
}

export default observer(themed('Card', Card))
