import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, useSession } from 'startupjs'
import { finishAuth } from '@startupjs/auth'
import { Div, Span, Br, Button } from '@startupjs/ui'
import { FORM_REGEXPS } from '@startupjs/auth-local/isomorphic'
import { SIGN_UP_SLIDE, SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import TextInput from '../TextInput'
import './index.styl'

const isWeb = Platform.OS === 'web'

function LoginForm ({
  formState = {},
  redirectUrl,
  baseUrl,
  onSuccess,
  onError,
  onHandleError,
  onChangeAuthPage
}) {
  const authHelper = useAuthHelper(baseUrl)

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
        onSuccess ? onSuccess(res.data, SIGN_IN_SLIDE) : finishAuth(redirectUrl)
      }
    } catch (error) {
      if (onHandleError) {
        onHandleError({ form, setFormErrors }, error)
      } else {
        onError && onError(error)
        if (error.response && error.response.status === 403) {
          const msg = 'The email or password you entered is incorrect'
          setFormErrors({ authError: msg })
        } else {
          setFormErrors({ authError: (error.response && error.response.data.message) || error.message })
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
    const { email } = formState
    if (email) $form.set('email', email)
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
    onChangeAuthPage(SIGN_UP_SLIDE)
  }

  function onRecover () {
    onChangeAuthPage(RECOVER_PASSWORD_SLIDE)
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
  redirectUrl: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeAuthPage: PropTypes.func.isRequired,
  baseUrl: PropTypes.string
}

export default observer(LoginForm)
