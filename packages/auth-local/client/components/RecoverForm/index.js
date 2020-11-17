import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Platform } from 'react-native'
import { Div, Span, Br, Button } from '@startupjs/ui'
import { observer, useValue } from 'startupjs'
import TextInput from '../TextInput'
import PropTypes from 'prop-types'
import { FORM_REGEXPS } from '@startupjs/auth-local/isomorphic'
import { useAuthHelper } from '@startupjs/auth-local/client'
import './index.styl'

const isWeb = Platform.OS === 'web'

function RecoverForm ({ onSuccess, onError, onChangeAuthPage }) {
  const authHelper = useAuthHelper()

  const [loading, setLoading] = useState()
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
      setLoading(true)
      await authHelper.createPassResetSecret(form)

      onSuccess && onSuccess(null, 'reset')

      setFeedback('Check your email for instructions')
      setLoading(false)
    } catch (err) {
      setFormErrors({ globalError: err.response.data.message })
      setLoading(false)
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
    if (isWeb) {
      listenKeypress()
    }
    return () => {
      if (isWeb) {
        unlistenKeypress()
      }
    }
  }, [])

  return pug`
    Div.root
      Span.text.center-text.header-text Forgot your password?
      Span.text.center-text.sub-header-text Enter email to reset your password
      Br
      if !feedBack
        TextInput(
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
      if (loading)
        ActivityIndicator
      if formErrors.globalError
        Br
        Span.authError
          = formErrors.globalError
      Br
      Button(
        onPress=onChangeAuthPage('login')
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
