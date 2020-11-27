import React from 'react'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'

function PRecover ({
  localForms,
  socialButtons,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      initSlide='recover'
      hasRouting=true
      localForms=localForms
      socialButtons=socialButtons
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PRecover.propTypes = {
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PRecover
