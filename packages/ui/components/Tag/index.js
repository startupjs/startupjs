import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Button from '../Button'

const size = 'xs'

function Tag (props) {
  return pug`
    Button(
      ...props
      size=size
    )
  `
}

Tag.defaultProps = {
  ...Button.defaultProps,
  color: 'primary',
  variant: 'flat',
  shape: 'circle',
  size
}

Tag.propTypes = {
  ...Button.propTypes,
  variant: PropTypes.oneOf(['flat', 'outlined']),
  shape: PropTypes.oneOf(['circle', 'rounded']),
  size: PropTypes.oneOf([size])
}

export default observer(Tag)
