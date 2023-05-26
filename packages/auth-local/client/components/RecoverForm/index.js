import React, { useEffect, useState, useRef } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, useSession } from 'startupjs'
import { Alert, Br, Span, Button, Input } from '@startupjs/ui'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import { Recaptcha } from '@startupjs/recaptcha'
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

const DEFAULT_CONFIG = {
  emailInputLabel: 'Email',
  emailInputPlaceholder: 'Enter your email',
  emailInputSize: 'm',
  resetButtonLabel: 'Get reset link',
  backButtonLabel: 'Back',
  buttonSize: 'm',
  showBackToLoginButton: true
}

function RecoverForm ({
  baseUrl,
  config,
  onSuccess,
  onError,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)
  const [recaptchaEnabled] = useSession('auth.recaptchaEnabled')

  const [form, $form] = useValue({ email: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const recaptchaRef = useRef()

  useEffect(() => {
    if (IS_WEB) {
      window.addEventListener('keypress', onKeyPress)
    }

    return () => {
      if (IS_WEB) {
        window.removeEventListener('keypress', onKeyPress)
      }
    }
  }, [])

  function onKeyPress (e) {
    if (e.key === 'Enter') recaptchaEnabled ? recaptchaRef.current.open() : createRecoverySecret()
  }

  async function createRecoverySecret (recaptcha) {
    try {
      await authHelper.createPassResetSecret({ ...form, recaptcha })
      onSuccess && onSuccess(null, RECOVER_PASSWORD_SLIDE)
      setMessage('Check your email for instructions')
      setErrors({})
    } catch (error) {
      setErrors({ server: _get(error, 'response.data.message', error.message) })
      recaptchaEnabled && recaptchaRef.current.close()
      onError && onError(error)
    }
  }

  const _config = _merge({}, DEFAULT_CONFIG, config)

  return pug`
    if !message
      if errors.server
        Alert(variant='error')= errors.server
        Br
      Input(
        type='text'
        name='email'
        label=_config.emailInputLabel
        description=_config.emailInputDescription
        placeholder=_config.emailInputPlaceholder
        size=_config.emailInputSize
        value=form.email
        testID='recover-email-input'
        onChangeText=t => $form.set('email', t)
      )
      if recaptchaEnabled
        Recaptcha(
          id='recover-form-captcha'
          ref=recaptchaRef
          onVerify=createRecoverySecret
        )
      Br(half)
      Button.button(
        color='primary'
        variant='flat'
        size=_config.buttonSize,
        testID='recover-pass-button'
        onPress=() => recaptchaEnabled ? recaptchaRef.current.open() : createRecoverySecret()
      )= _config.resetButtonLabel
    else
      Span.text= message

    if _config.showBackToLoginButton
      Button.back(
        variant='text'
        color='primary'
        size=_config.buttonSize
        testID='back-to-signin-button'
        onPress=() => onChangeSlide(SIGN_IN_SLIDE)
      )= _config.backButtonLabel
  `
}

RecoverForm.propTypes = {
  baseUrl: PropTypes.string,
  config: PropTypes.object,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(RecoverForm)
