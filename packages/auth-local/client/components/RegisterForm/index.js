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

function RegisterForm ({
  onSuccess,
  onError,
  onChangeAuthPage
}) {
  const authHelper = useAuthHelper()

  const [form, $form] = useValue({
    name: null,
    email: null,
    password: null,
    confirm: null
  })

  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const onFormChange = field => value => {
    $form.set(field, value)
  }

  // TODO: ref validation | use hapi?
  const validateFields = () => {
    const errors = {}
    const fields = Object.keys(form)
    let isFormValid = true

    fields.forEach(fieldName => {
      const rules = FORM_REGEXPS[fieldName]
      let error

      if (fieldName === 'confirm') {
        if (form[fieldName] !== form.password) {
          error = 'Passwords doesn\'t match'
        }
      } else {
        if (rules && !rules.re.test(form[fieldName])) {
          error = rules.error
        }
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
    setFormErrors({})

    if (!validateFields()) {
      return
    }

    const formClone = { ...form }
    formClone.userData = {
      firstName: form.name.split(' ').shift(),
      lastName: form.name.split(' ').pop()
    }
    delete formClone.name

    try {
      setLoading(true)
      await authHelper.register(formClone)
      const res = await authHelper.login({ email: form.email, password: form.password })

      if (res.data) {
        onSuccess ? onSuccess(res.data, 'register') : finishAuth()
      }
    } catch (error) {
      setFormErrors({ authError: error.response.data.message })
      setLoading(false)
      onError && onError(error)
    }
  }

  function onKeyPress (e) {
    if (e.key === 'Enter') {
      submit()
    }
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
      onChangeText=onFormChange('name')
      error=formErrors.name
      label='Full name'
      name='name'
      placeholder='Enter your full name'
      value=form.name || ''
    )
    Br
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
    Br
    TextInput(
      onChangeText=onFormChange('confirm')
      error=formErrors.confirm
      name='confirm'
      placeholder='Confirm your password'
      secureTextEntry
      value=form.confirm || ''
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
      variant='flat'
      color='primary'
    ) Sign up
    Br
    Div.line
      Span.text Have an accoun?
      Button(
        onPress=onChangeAuthPage('login')
        variant='text'
        color='primary'
      ) Login
  `
}

export default observer(RegisterForm)
