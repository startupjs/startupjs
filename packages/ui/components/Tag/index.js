import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Button from '../Button'

function Tag ({ size, ...props }) {
  return pug`
    //- button is clickable by default, override this behavior
    Button(
      onPress=null
      size=size
      ...props
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
  variant: PropTypes.oneOf(['flat', 'outlined']),
  shape: PropTypes.oneOf(['circle', 'rounded']),
  size: PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl'])
}

export default observer(Tag)
