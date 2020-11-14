import React from 'react'
import { AuthForm } from '../../../components'
import PropTypes from 'prop-types'

function PSignIn ({
  components,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      initSlide='sign-in'
      hasRouting=true
      components=components
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PSignIn.propTypes = {
  components: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PSignIn
