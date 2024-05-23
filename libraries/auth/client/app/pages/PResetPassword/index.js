import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'
import { RESET_PASSWORD_SLIDE } from '../../../../isomorphic'
import '../common.styl'

function PResetPassword ({
  baseUrl,
  redirectUrl,
  localForms,
  renderForm,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      baseUrl=baseUrl
      redirectUrl=redirectUrl
      slide=RESET_PASSWORD_SLIDE
      localForms=localForms
      renderForm=renderForm
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PResetPassword.propTypes = {
  baseUrl: PropTypes.string,
  redirectUrl: PropTypes.string,
  localForms: PropTypes.object,
  renderForm: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  onHandleError: PropTypes.func
}

export default observer(PResetPassword)
