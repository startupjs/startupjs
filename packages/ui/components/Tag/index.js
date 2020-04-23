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
  iconPosition: 'left'
}

Tag.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['flat', 'outlined']),
  shape: propTypes.oneOf(['circle', 'rounded']),
  color: propTypes.string,
  textColor: propTypes.string,
  icon: propTypes.object,
  iconPosition: propTypes.oneOf(['left', 'right']),
  iconColor: propTypes.string
}

export default observer(Tag)
