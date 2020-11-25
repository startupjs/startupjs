import React from 'react'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'

function PSignUp ({
  localForms,
  socialButtons,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      initSlide='sign-up'
      hasRouting=true
      localForms=localForms
      socialButtons=socialButtons
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PSignUp.propTypes = {
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PSignUp
