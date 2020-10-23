import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, Platform } from 'react-native'
import { Div, Span, Br, Button } from '@startupjs/ui'
import TextInput from '../TextInput'
import { observer, useValue } from 'startupjs'
import { finishAuth } from '@startupjs/auth'
import { useAuthHelper } from '@startupjs/auth-local/client'
import { FORM_REGEXPS } from '@startupjs/auth-local/isomorphic'
import './index.styl'

const isWeb = Platform.OS === 'web'

function LoginForm ({
  onSuccess,
  onError,
  onHandleError,
  onChangeAuthPage
}) {
  const authHelper = useAuthHelper()

  const [form, $form] = useValue({
    email: null,
    password: null
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const onFormChange = field => value => {
    $form.set(field, value)
  }

  // TODO: ref validation | use hapi?
  const validateFields = () => {
    setFormErrors({})

    const fields = Object.keys(form)
    const errors = {}
    let isFormValid = true

    fields.forEach(fieldName => {
      const rules = FORM_REGEXPS[fieldName]
      let error

      if (rules && !rules.re.test(form[fieldName])) {
        error = rules.error
      }

      if (error) {
        isFormValid = false
      }

      errors[fieldName] = error
    })

    setFormErrors(errors)

    return isFormValid
  }

  const submit = async () => {
    if (!validateFields()) {
      return
    }

    try {
      setLoading(true)
      const res = await authHelper.login(form)

      if (res.data) {
        onSuccess ? onSuccess(res.data, 'login') : finishAuth()
      }
    } catch (error) {
      if (onHandleError) {
        onHandleError({ form, setFormErrors }, error)
      } else {
        onError && onError(error)
        if (error.response.status === 403) {
          const msg = 'The email or password you entered is incorrect'
          setFormErrors({ authError: msg })
        } else {
          setFormErrors({ authError: error.response.data.message })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  function onKeyPress (e) {
    if (e.key === 'Enter') submit()
  }

  function listenKeypress () {
    window.addEventListener('keypress', onKeyPress)
  }

  function unlistenKeypress () {
    window.removeEventListener('keypress', onKeyPress)
  }
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
    TextInput(
      onChangeText=onFormChange('email')
      error=formErrors.email
      label='Email'
      name='email'
      placeholder='Enter your email'
      value=form.email || ''
    )
    Br
    TextInput(
      onChangeText=onFormChange('password')
      error=formErrors.password
      label='Password'
      name='password'
      placeholder='Enter your password'
      secureTextEntry
      value=form.password || ''
    )
    if loading
      Br
      ActivityIndicator
    if formErrors.authError
      Br
      Span.authError
        = formErrors.authError
    Br
    Button(
      onPress=submit
      color='primary'
      variant='flat'
    ) Log in
    Br
    Button(
      onPress=onChangeAuthPage('recover')
      color='primary'
      variant='text'
    ) Forgot your password?
    Br
    Div.line
      Span.text Don't have an accoun?
      Button(
        onPress=onChangeAuthPage('register')
        color='primary'
        variant='text'
      ) Sign up
  `
}

export default observer(LoginForm)
