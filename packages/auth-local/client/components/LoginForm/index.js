import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, emit, useSession } from 'startupjs'
import { finishAuth } from '@startupjs/auth'
import { Div, Span, Br, Button } from '@startupjs/ui'
import { useAuthHelper } from '@startupjs/auth-local'
import { FORM_REGEXPS } from '@startupjs/auth-local/isomorphic'
import { SIGN_UP_SLIDE, SIGN_IN_SLIDE } from '@startupjs/auth/isomorphic'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import './index.styl'

const isWeb = Platform.OS === 'web'

function LoginForm ({ onSuccess, onError, onHandleError, onChangeAuthPage }) {
  const authHelper = useAuthHelper()

  const [localSignUpEnabled] = useSession('auth.local.localSignUpEnabled')

  const [formErrors, setFormErrors] = useState({})
  const [form, $form] = useValue({
    email: null,
    password: null
  })

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
      const res = await authHelper.login(form)

      if (res.data) {
        onSuccess ? onSuccess(res.data, SIGN_IN_SLIDE) : finishAuth()
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

  function onRegister () {
    if (onChangeAuthPage) onChangeAuthPage(SIGN_UP_SLIDE)
    else emit('url', '/auth/sign-up')
  }

  function onRecover () {
    if (onChangeAuthPage) onChangeAuthPage('recover')
    else emit('url', '/auth/recover')
  }

  return pug`
    Div.root
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
      if formErrors.authError
        Br
        Span.authError
          = formErrors.authError
      Br(lines=2)
      Button(
        size='l'
        onPress=submit
        color='primary'
        variant='flat'
      ) Log in
      Br
      Button(
        onPress=onRecover
        color='primary'
        variant='text'
      ) Forgot your password?
      if localSignUpEnabled
        Br(half)
        Div.line
          Span.text Don't have an account?
          Button.signUp(
            onPress=onRegister
            color='primary'
            variant='text'
          ) Sign up
  `
}

LoginForm.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeAuthPage: PropTypes.func
}

export default observer(LoginForm)
