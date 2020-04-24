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
  ...Button.defaultProps,
  color: 'primary',
  variant: 'flat',
  shape: 'circle'
}

Tag.propTypes = {
  ...Button.propTypes,
  variant: propTypes.oneOf(['flat', 'outlined']),
  shape: propTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
