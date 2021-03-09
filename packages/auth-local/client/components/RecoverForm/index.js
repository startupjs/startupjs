import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Span, Button, TextInput, ErrorWrapper } from '@startupjs/ui'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

const DEFAULT_CONFIG = {
  emailInputLabel: 'Email',
  emailInputPlaceholder: 'Enter your email',
  resetButtonLabel: 'Get reset link',
  backButtonLabel: 'Back'
}

function RecoverForm ({
  baseUrl,
  config,
  onSuccess,
  onError,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)

  const [form, $form] = useValue({ email: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

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
    if (e.key === 'Enter') createRecoverySecret()
  }

  async function createRecoverySecret () {
    try {
      await authHelper.createPassResetSecret(form)
      onSuccess && onSuccess(null, RECOVER_PASSWORD_SLIDE)
      setMessage('Check your email for instructions')
      setErrors({})
    } catch (error) {
      setErrors({ server: _get(error, 'response.data.message', error.message) })
      onError && onError(error)
    }
  }

  const _config = _merge({}, DEFAULT_CONFIG, config)

  return pug`
    if !message
      ErrorWrapper(err=errors.server)
        TextInput(
          name='email'
          label=_config.emailInputLabel
          placeholder=_config.emailInputPlaceholder
          value=form.email
          onChangeText=t => $form.set('email', t)
        )

      Button.button(
        color='primary'
        variant='flat'
        onPress=createRecoverySecret
      )= _config.resetButtonLabel
    else
      Span.text= message

    Button.back(
      variant='text'
      color='primary'
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
