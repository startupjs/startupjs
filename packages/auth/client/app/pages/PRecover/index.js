import React from 'react'
import PropTypes from 'prop-types'
import { AuthForm } from '../../../components'
import { RECOVER_PASSWORD_SLIDE } from '../../../../isomorphic'
import '../common.styl'

function PRecover ({
  baseUrl,
  localForms,
  socialButtons,
  onError,
  onSuccess,
  onHandleError,
  onChangeSlide
}) {
  return pug`
    AuthForm(
      baseUrl=baseUrl
      slide=RECOVER_PASSWORD_SLIDE
      localForms=localForms
      socialButtons=socialButtons
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
      onChangeSlide=onChangeSlide
    )
  `
}

PRecover.propTypes = {
  baseUrl: PropTypes.string,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default PRecover
