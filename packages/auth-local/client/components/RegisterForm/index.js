import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, useError, useSession } from 'startupjs'
import { Row, Div, Span, Button, ObjectInput, ErrorWrapper } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import { SIGN_IN_SLIDE, SIGN_UP_SLIDE } from '@startupjs/auth/isomorphic'
import { Recaptcha } from '@startupjs/recaptcha'
import _get from 'lodash/get'
import _mergeWith from 'lodash/mergeWith'
import _pickBy from 'lodash/pickBy'
import _identity from 'lodash/identity'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import commonSchema from './utils/joi'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

const REGISTER_DEFAULT_INPUTS = {
  name: {
    input: 'text',
    label: 'Full name',
    placeholder: 'Enter your full name'
  },
  email: {
    input: 'text',
    label: 'Email',
    placeholder: 'Enter your email'
  },
  password: {
    input: 'password',
    label: 'Password',
    placeholder: 'Enter your password'
  },
  confirm: {
    input: 'password',
    placeholder: 'Confirm your password'
  }
}

function RegisterForm ({
  baseUrl,
  redirectUrl,
  properties,
  validateSchema,
  renderActions,
  onSuccess,
  onError,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)

  const [form, $form] = useValue(initForm(properties))
  const [errors, setErrors] = useError({})
  const [recaptchaEnabled] = useSession('Recaptcha.recaptchaSecretKeyExists')

  const recaptchaRef = useRef()

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
    if (e.key === 'Enter') recaptchaEnabled ? recaptchaRef.current.open() : onSubmit()
  }

  async function onSubmit (recaptchaToken) {
    setErrors({})

    let fullSchema = commonSchema
    if (validateSchema) {
      fullSchema = fullSchema.keys(validateSchema)
    }

    if (errors.check(fullSchema, form)) return

    const formClone = { ...form, recaptchaToken }
    if (formClone.name) {
      formClone.firstName = form.name.split(' ').shift()
      formClone.lastName = form.name.split(' ').pop()
      delete formClone.name
    }

    try {
      await authHelper.register(formClone)
      const res = await authHelper.login({
        email: form.email,
        password: form.password
      })

      if (res.data) {
        onSuccess ? onSuccess(res.data, SIGN_UP_SLIDE) : finishAuth(redirectUrl)
      }
    } catch (error) {
      onError && onError(error)
      setErrors({ server: _get(error, 'response.data.message', error.message) })
    }
  }

  const _properties = _pickBy(
    _mergeWith(
      REGISTER_DEFAULT_INPUTS, properties,
      (a, b) => (b === null) ? null : undefined
    ),
    _identity
  )

  return pug`
    ObjectInput(
      value=form
      $value=$form
      errors=errors
      properties=_properties
    )

    ErrorWrapper(err=errors.server)

    if renderActions
      = renderActions({ onSubmit, onChangeSlide })
    else
      Div.actions
        if recaptchaEnabled
          Recaptcha(
            id='register-form-captcha'
            ref=recaptchaRef
            onVerify=onSubmit
          )
        Button(
          onPress=() => recaptchaEnabled ? recaptchaRef.current.open() : onSubmit()
          variant='flat'
          color='primary'
        ) Sign Up
        Row.actionChoice
          Span.actionText Have an account?
          Button.login(
            onPress=() => onChangeSlide(SIGN_IN_SLIDE)
            variant='text'
            color='primary'
          ) Sign In
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

RegisterForm.propTypes = {
  baseUrl: PropTypes.string,
  redirectUrl: PropTypes.string,
  properties: PropTypes.object,
  validateSchema: PropTypes.object,
  renderActions: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(RegisterForm)
