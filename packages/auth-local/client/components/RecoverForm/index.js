import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { useHistory } from 'react-router'
import { observer, useValue } from 'startupjs'
import { Div, Span, Br, Button } from '@startupjs/ui'
import { FORM_REGEXPS } from '@startupjs/auth-local/isomorphic'
import { useAuthHelper } from '@startupjs/auth-local/client'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import './index.styl'

const isWeb = Platform.OS === 'web'

function RecoverForm ({ onSuccess, onError, onChangeAuthPage }) {
  const authHelper = useAuthHelper()
  const history = useHistory()

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
      onSuccess && onSuccess(null, 'reset')
      setFeedback('Check your email for instructions')
    } catch (err) {
      setFormErrors({ globalError: err.response.data.message })
      onError && onError(err)
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
    if (onChangeAuthPage) onChangeAuthPage('sign-in')
    else history.push('/auth/sign-in')
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
  onChangeAuthPage: PropTypes.func
}

export default observer(RecoverForm)
