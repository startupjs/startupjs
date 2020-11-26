import React from 'react'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'

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
