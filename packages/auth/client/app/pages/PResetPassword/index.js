import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'
import { RESET_PASSWORD_SLIDE } from '../../../../isomorphic'
import '../common.styl'

function PResetPassword ({
  baseUrl,
  localForms,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      baseUrl=baseUrl
      slide=RESET_PASSWORD_SLIDE
      localForms=localForms
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PResetPassword.propTypes = {
  baseUrl: PropTypes.string,
  localForms: PropTypes.object,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  onHandleError: PropTypes.func
}

export default observer(PResetPassword)
