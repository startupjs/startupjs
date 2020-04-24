import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Button from '../Button'

function Tag (props) {
  return pug`
    Button(...props size='xs')
  `
}

Tag.defaultProps = {
  color: 'primary',
  variant: 'flat',
  shape: 'circle',
  iconPosition: Button.defaultProps.iconPosition
}

Tag.propTypes = {
  style: Button.propTypes.style,
  children: Button.propTypes.children,
  variant: propTypes.oneOf(['flat', 'outlined']),
  shape: propTypes.oneOf(['circle', 'rounded']),
  color: Button.propTypes.color,
  textColor: Button.propTypes.textColor,
  icon: Button.propTypes.icon,
  iconColor: Button.propTypes.iconColor,
  iconPosition: Button.propTypes.iconPosition
}

export default observer(Tag)
