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
  size: 'xs'
}

Tag.propTypes = {
  ...Button.propTypes,
  size: PropTypes.oneOf(['xs']),
  variant: PropTypes.oneOf(['flat', 'outlined']),
  shape: PropTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
