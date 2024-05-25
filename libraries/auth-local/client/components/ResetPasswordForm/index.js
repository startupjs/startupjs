import React from 'react'
import { pug, observer, useQueryDoc, useValue, useDoc, $root } from 'startupjs'
import { useAuthHelper } from '@startupjs/auth-local'
import { Alert, Br, Span, Div, Button, PasswordInput } from '@startupjs/ui'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import './index.styl'

export default observer(function ResetPasswordForm ({
  baseUrl,
  secret,
  onSuccess,
  onChangeSlide
}) {
  const authHelper = useAuthHelper(baseUrl)

  const _secret = secret || $root.get('$render.query.secret')

  const [form, $form] = useValue({})
  const [error, $error] = useValue()
  const [feedback, $feedback] = useValue()
  const [auth] = useQueryDoc('auths', { 'providers.local.passwordResetMeta.secret': secret })
  const [user] = useDoc('users', _get(auth, 'id') || '_DUMMY_')

  function _onSuccess () {
    $feedback.set('Your password has been changed successfully.')
    onSuccess && onSuccess(user.id)
  }

  async function onSubmit () {
    if (!form.password || form.password.length < 8) {
      $error.set('Your password must be between 8 - 32 characters long')
      return
    }

    if (!form.confirm) {
      $error.set('Please fill password confirmation')
      return
    }

    if (form.password !== form.confirm) {
      $error.set('Password should match confirmation')
      return
    }

    try {
      await authHelper.resetPassword({
        secret: _secret,
        ...form
      })
      _onSuccess(null, RECOVER_PASSWORD_SLIDE)
    } catch (error) {
      const errorMsg = _get(error, 'response.data.message', error.message)
      if (errorMsg === 'reset password expired' && user) {
        $error.set('Link is expired')
        return
      } else if (errorMsg === 'No user found by secret') {
        $error.set('Link is invalid')
        return
      }
      $error.set(errorMsg)
    }
  }

  const onInputChange = (key, value) => {
    if (error) $error.del()
    $form.set(key, value)
  }

  function onLogin () {
    onChangeSlide(SIGN_IN_SLIDE)
  }

  return pug`
    if !_secret
      Span.feedback= 'Please provide password reset secret'
    else
      Div.content
        if !feedback
          if error
            Alert(variant='error')= error
            Br
          PasswordInput.input(
            label='Enter new password'
            name='password'
            placeholder='Password'
            value=form.password || ''
            onChangeText=t=> onInputChange('password', t)
          )
          PasswordInput.input(
            name='confirm'
            placeholder='Confirm'
            value=form.confirm || ''
            onChangeText=t=> onInputChange('confirm', t)
          )
          Button.submit(
            variant='flat'
            color='primary'
            disabled=!form.confirm || !form.password
            onPress=onSubmit
          ) SAVE
        else
          Span.feedback= feedback
          Button(
            variant='flat'
            color='primary'
            onPress=onLogin
          ) Log in
  `
})
