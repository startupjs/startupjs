import React from 'react'
import { pug } from 'startupjs'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'
import { RECOVER_PASSWORD_SLIDE } from '../../../../isomorphic'
import '../common.styl'

function PRecover ({
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
      slide=RECOVER_PASSWORD_SLIDE
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

PRecover.propTypes = {
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

export default PRecover
