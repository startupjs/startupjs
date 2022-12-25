import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { observer, useValue, useError, useSession } from 'startupjs'
import { Alert, Br, Row, Div, Span, Button, ObjectInput } from '@startupjs/ui'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import {
  REQUEST_CONFIRMATION_SLIDE,
  SIGN_IN_SLIDE,
  SIGN_UP_SLIDE
} from '@startupjs/auth/isomorphic'
import { Recaptcha } from '@startupjs/recaptcha'
import moment from 'moment'
import { BASE_URL } from '@env'
import _get from 'lodash/get'
import _flow from 'lodash/flow'
import _mergeWith from 'lodash/mergeWith'
import _pickBy from 'lodash/pickBy'
import _identity from 'lodash/identity'
import PropTypes from 'prop-types'
import { useAuthHelper } from '../../helpers'
import { getValidationSchema } from './utils/getValidationSchema'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

const REGISTER_DEFAULT_INPUTS = {
  name: {
    input: 'text',
    label: 'Full name',
    placeholder: 'Enter your full name',
    autoComplete: 'username'
  },
  email: {
    input: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    autoCapitalize: 'none',
    autoComplete: 'email'
  },
  password: {
    input: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    autoCapitalize: 'none',
    autoComplete: 'password'
  },
  confirm: {
    input: 'password',
    placeholder: 'Confirm your password',
    autoCapitalize: 'none',
    autoComplete: 'password-new'
  }
}

function RegisterForm ({
  baseUrl,
  passwordCheckType,
  recaptchaBadgePosition,
  redirectUrl,
  properties,
  validateSchema,
  renderActions,
  onShouldConfirmRegistration,
  onSuccess,
  onError,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)
  const [expiresRedirectUrl] = useSession('auth.expiresRedirectUrl')
  const [form, $form] = useValue(initForm(properties))
  const [errors, setErrors] = useError({})
  const [recaptchaEnabled] = useSession('auth.recaptchaEnabled')
  const [confirmRegistration] = useSession('auth.local.confirmRegistration')

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

  async function onSubmit (recaptcha) {
    setErrors({})

    let fullSchema = getValidationSchema({ passwordCheckType })
    if (validateSchema) {
      fullSchema = fullSchema.keys(validateSchema)
    }

    const isInvalid = errors.check(fullSchema, form)

    if (isInvalid) {
      if (recaptchaEnabled) recaptchaRef.current.close()
      return
    }

    const formClone = { ...form }
    if (recaptchaEnabled) formClone.recaptcha = recaptcha
    if (formClone.name) {
      formClone.firstName = form.name.split(' ').shift()
      formClone.lastName = form.name.split(' ').slice(1).join(' ')
      delete formClone.name
    }

    try {
      if (redirectUrl) {
        await CookieManager.set({
          baseUrl,
          name: 'authRedirectUrl',
          value: redirectUrl,
          expires: moment().add(expiresRedirectUrl, 'milliseconds')
        })
      }

      const userId = await authHelper.register(formClone)

      if (confirmRegistration) {
        return onShouldConfirmRegistration
          ? onShouldConfirmRegistration(userId, REQUEST_CONFIRMATION_SLIDE)
          : onChangeSlide(REQUEST_CONFIRMATION_SLIDE)
      }

      const res = await authHelper.login({
        email: form.email,
        password: form.password
      })

      if (res.data) {
        onSuccess
          ? onSuccess(res.data, SIGN_UP_SLIDE)
          : clientFinishAuth(res.request.responseURL.replace(baseUrl, ''))
      }
    } catch (error) {
      onError && onError(error)
      setErrors({ server: _get(error, 'response.data.message', error.message) })
      if (recaptchaEnabled) recaptchaRef.current.close()
    }
  }

  const _properties = _flow([
    Object.entries,
    arr => arr.filter(([key, value]) => !value.hidden),
    Object.fromEntries
  ])(
    _pickBy(
      _mergeWith(
        { ...REGISTER_DEFAULT_INPUTS },
        properties,
        (a, b) => (b === null) ? null : undefined
      ),
      _identity
    )
  )

  return pug`
    if errors.server
      Alert(variant='error')= errors.server
      Br
    ObjectInput(
      value=form
      $value=$form
      errors=errors
      properties=_properties
    )

    if renderActions
      = renderActions({ onSubmit, onChangeSlide, recaptchaRef })
    else
      Div.actions
        if recaptchaEnabled
          Recaptcha(
            id='register-form-captcha'
            badge=recaptchaBadgePosition
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

RegisterForm.defaultProps = {
  baseUrl: BASE_URL,
  passwordCheckType: 'simple'
}

RegisterForm.propTypes = {
  baseUrl: PropTypes.string,
  passwordCheckType: PropTypes.oneOf(['complex', 'simple']),
  recaptchaBadgePosition: Recaptcha.propTypes.badge,
  redirectUrl: PropTypes.string,
  properties: PropTypes.object,
  validateSchema: PropTypes.object,
  renderActions: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(RegisterForm)
