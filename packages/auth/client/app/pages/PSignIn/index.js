import React from 'react'
import { AuthForm } from '../../../components'
import PropTypes from 'prop-types'

function PSignIn ({
  localForms,
  socialButtons,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      initSlide='sign-in'
      hasRouting=true
      localForms=localForms
      socialButtons=socialButtons
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PSignIn.propTypes = {
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PSignIn
