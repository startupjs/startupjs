import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Button from '../Button'

function Tag (props) {
  return pug`
    Button(
      ...props
      size='xs'
    )
  `
}

Tag.defaultProps = {
  ...Button.defaultProps,
  color: 'primary',
  variant: 'flat',
  shape: 'circle'
}

Tag.propTypes = {
  variant: PropTypes.oneOf(['flat', 'outlined']),
  shape: PropTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
