import React from 'react'
import { AuthForm } from '../../../components'
import PropTypes from 'prop-types'

function PSignUp ({
  components,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      initSlide='sign-up'
      hasRouting=true
      components=components
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PSignUp.propTypes = {
  components: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PSignUp
