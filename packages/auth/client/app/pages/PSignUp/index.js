import React from 'react'
import { pug } from 'startupjs'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'
import { SIGN_UP_SLIDE } from '../../../../isomorphic'
import '../common.styl'

function PSignUp ({
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
      slide=SIGN_UP_SLIDE
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

PSignUp.propTypes = {
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

export default PSignUp
