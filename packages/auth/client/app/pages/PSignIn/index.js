import React from 'react'
import { pug } from 'startupjs'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'
import { SIGN_IN_SLIDE } from '../../../../isomorphic'
import '../common.styl'

function PSignIn ({
  baseUrl,
  redirectUrl,
  localForms,
  socialButtons,
  renderForm,
  onError,
  onSuccess,
  onHandleError,
  onChangeSlide
}) {
  return pug`
    AuthForm(
      baseUrl=baseUrl
      redirectUrl=redirectUrl
      slide=SIGN_IN_SLIDE
      localForms=localForms
      socialButtons=socialButtons
      renderForm=renderForm
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
      onChangeSlide=onChangeSlide
    )
  `
}

PSignIn.propTypes = {
  baseUrl: PropTypes.string,
  redirectUrl: PropTypes.string,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  renderForm: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default PSignIn
