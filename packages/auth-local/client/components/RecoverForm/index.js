import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Span, Button, TextInput, ErrorWrapper } from '@startupjs/ui'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

function RecoverForm ({
  baseUrl,
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

  return pug`
    if !message
      ErrorWrapper(err=errors.server)
        TextInput(
          name='email'
          value=form.email
          label='Enter your email'
          placeholder='Email'
          onChangeText=t => $form.set('email', t)
        )

      Button.button(
        onPress=createRecoverySecret
        color='primary'
        variant='flat'
      ) Get reset link
    else
      Span.text= message

    Button.back(
      onPress=() => onChangeSlide(SIGN_IN_SLIDE)
      variant='text'
      color='primary'
    ) Back
  `
}

RecoverForm.propTypes = {
  baseUrl: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(RecoverForm)
