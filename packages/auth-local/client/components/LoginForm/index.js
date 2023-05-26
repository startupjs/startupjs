import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, useSession, useError } from 'startupjs'
import {
  Alert,
  Br,
  Button,
  Div,
  ObjectInput,
  Row,
  Span
} from '@startupjs/ui'
import {
  SIGN_UP_SLIDE,
  SIGN_IN_SLIDE,
  RECOVER_PASSWORD_SLIDE
} from '@startupjs/auth/isomorphic'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import moment from 'moment'
import _get from 'lodash/get'
import _mergeWith from 'lodash/mergeWith'
import _pickBy from 'lodash/pickBy'
import _identity from 'lodash/identity'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import commonSchema from './utils/joi'
import { ERROR_USER_NOT_CONFIRMED } from '../../../isomorphic'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

const LOGIN_DEFAULT_INPUTS = {
  email: {
    input: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    testID: 'auth-email-input',
    autoCapitalize: 'none',
    autoComplete: 'email'
  },
  password: {
    input: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    testID: 'auth-password-input',
    autoCapitalize: 'none',
    autoComplete: 'password'
  }
}

function LoginForm ({
  baseUrl,
  redirectUrl,
  properties,
  validateSchema,
  renderActions,
  onSuccess,
  onError,
  onHandleError,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)

  const [localSignUpEnabled] = useSession('auth.local.localSignUpEnabled')
  const [expiresRedirectUrl] = useSession('auth.expiresRedirectUrl')

  const [form, $form] = useValue(initForm(properties))
  const [errors, setErrors] = useError({})
  const [successAlert, setSuccessAlert] = useState()

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

  // TODO: next input
  function onKeyPress (e) {
    if (e.key === 'Enter') onSubmit()
  }

  const onSubmit = async () => {
    setSuccessAlert()
    setErrors({})

    let fullSchema = commonSchema
    if (validateSchema) {
      fullSchema = fullSchema.keys(validateSchema)
    }

    if (errors.check(fullSchema, form)) return

    try {
      if (redirectUrl) {
        await CookieManager.set({
          baseUrl,
          name: 'authRedirectUrl',
          value: redirectUrl,
          expires: moment().add(expiresRedirectUrl, 'milliseconds')
        })
      }

      const res = await authHelper.login(form)

      if (res.data) {
        onSuccess
          ? onSuccess(res.data, SIGN_IN_SLIDE)
          : clientFinishAuth(res.request.responseURL.replace(baseUrl, ''))
      }
    } catch (error) {
      if (onHandleError) {
        onHandleError({ form, setErrors }, error)
      } else {
        onError && onError(error)

        if (error.response && error.response.status === 403) {
          setErrors({ server: 'The email or password you entered is incorrect' })
        } else {
          const { message, code } = _get(error, 'response.data', error.message, {})
          setErrors({ server: { message, code } })
        }
      }
    }
  }

  const _properties = _pickBy(
    _mergeWith(
      { ...LOGIN_DEFAULT_INPUTS },
      properties,
      (a, b) => (b === null) ? null : undefined
    ),
    _identity
  )

  async function resendConfirmation () {
    try {
      await authHelper.resendEmailConfirmation(form.email)
    } catch (error) {
      const { message } = error.response.data
      setErrors({ server: { message } })
    }
    setErrors({})
    setSuccessAlert('Confirmation email has been sent to your email')
  }

  let errMessage

  if (errors.server) {
    if (errors.server.code === ERROR_USER_NOT_CONFIRMED) {
      errMessage = pug`
        Span
          Span= errors.server.message + '.'
          Span 
            Span.resendLink(onPress=resendConfirmation) Resend
            Span  confirmation
      `
    } else {
      errMessage = errors.server.message
    }
  }

  return pug`
    if successAlert
      Alert(variant='success')= successAlert
      Br
    if errors.server
      Alert(
        variant='error'
      )= errMessage
      Br
    ObjectInput(
      value=form
      $value=$form
      errors=errors
      properties=_properties
    )

    if renderActions
      = renderActions({ onSubmit, onChangeSlide })
    else
      Div.actions
        Button(
          size='l'
          onPress=onSubmit
          color='primary'
          variant='flat'
          testID='auth-login-button'
        ) Log in
        Button.recover(
          onPress=()=> onChangeSlide(RECOVER_PASSWORD_SLIDE)
          color='primary'
          variant='text'
          testID='auth-forgot-pass-slide-button'
        ) Forgot your password?

        if localSignUpEnabled
          Row.actionChoice
            Span.actionText Don't have an account?
            Button.signUp(
              onPress=()=> onChangeSlide(SIGN_UP_SLIDE)
              color='primary'
              variant='text'
              testID='auth-sign-up-slide-button'
            ) Sign up
  `
}

function initForm (properties) {
  const initData = {}
  properties && Object.keys(properties).forEach(key => {
    if (properties[key]?.initValue) {
      initData[key] = properties[key].initValue
    }
  })
  return initData
}

LoginForm.defaultProps = {
  baseUrl: BASE_URL
}

LoginForm.propTypes = {
  baseUrl: PropTypes.string,
  redirectUrl: PropTypes.string,
  properties: PropTypes.object,
  validateSchema: PropTypes.object,
  renderActions: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(LoginForm)
