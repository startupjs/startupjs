import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Div, Span, Br, Button } from '@startupjs/ui'
import { FORM_REGEXPS } from '@startupjs/auth-local/isomorphic'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import TextInput from '../TextInput'
import './index.styl'

const isWeb = Platform.OS === 'web'

function RecoverForm ({ baseUrl, onSuccess, onError, onChangeAuthPage }) {
  const authHelper = useAuthHelper(baseUrl)

  const [form, $form] = useValue({
    email: null,
    secret: null,
    password: null,
    confirm: null
  })
  const [formErrors, setFormErrors] = useState({})
  const [feedBack, setFeedback] = useState(null)

  const onFormChange = field => value => {
    $form.set(field, value)
  }

  // TODO: ref validation | use hapi?
  async function createRecoverySecret () {
    if (!FORM_REGEXPS.email.re.test(form.email)) {
      setFormErrors({ ...formErrors, email: FORM_REGEXPS.email.error })
      return
    }
    try {
      await authHelper.createPassResetSecret(form)
      onSuccess && onSuccess(null, RECOVER_PASSWORD_SLIDE)
      setFeedback('Check your email for instructions')
    } catch (error) {
      setFormErrors({ globalError: _get(error, 'response.data.message', error.message) })
      onError && onError(error)
    }
  }

  function onKeyPress (e) {
    if (e.key === 'Enter') {
      createRecoverySecret()
    }
  }

  function listenKeypress () {
    window.addEventListener('keypress', onKeyPress)
  }

  function unlistenKeypress () {
    window.removeEventListener('keypress', onKeyPress)
  }

  useEffect(() => {
    setFormErrors({})
  }, [feedBack])

  useEffect(() => {
    if (isWeb) listenKeypress()
    return () => {
      if (isWeb) unlistenKeypress()
    }
  }, [])

  function onLogin () {
    onChangeAuthPage(SIGN_IN_SLIDE)
  }

  return pug`
    Div.root
      if !feedBack
        TextInput(
          label='Enter your email'
          onChangeText=onFormChange('email')
          error=formErrors.email
          name='email'
          placeholder='Email'
          value=form.email || ''
        )
        Br
        Button(
          onPress=createRecoverySecret
          color='primary'
          variant='flat'
        ) Get reset link
      else
        Span.text.center-text
          = feedBack
      if formErrors.globalError
        Br
        Span.authError
          = formErrors.globalError
      Br
      Button.button(
        onPress=onLogin
        variant='text'
        color='primary'
      ) Back
  `
}

RecoverForm.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeAuthPage: PropTypes.func.isRequired,
  baseUrl: PropTypes.string
}

export default observer(RecoverForm)
