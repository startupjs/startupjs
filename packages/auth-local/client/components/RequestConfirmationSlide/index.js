import React from 'react'
import { observer } from 'startupjs'
import { Alert } from '@startupjs/ui'
import PropTypes from 'prop-types'

function RequestConfirmationSlide ({ message }) {
  return pug`
    Alert(
      variant='warning'
    )= message
  `
}

RequestConfirmationSlide.propTypes = {
  message: PropTypes.string
}

RequestConfirmationSlide.defaultProps = {
  message: 'We have sent you an email. Please follow the link in it to confirm your email and complete your registration.'
}

export default observer(RequestConfirmationSlide)
