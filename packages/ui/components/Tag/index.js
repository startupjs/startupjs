import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Button from '../Button'

function Tag (props) {
  return pug`
    //- button is clickable by default, override this behavior
    Button(
      onPress=null
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
  ...Button.propTypes,
  variant: PropTypes.oneOf(['flat', 'outlined']),
  shape: PropTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
