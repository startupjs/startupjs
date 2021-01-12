import React from 'react'
import { observer, useQueryDoc, useValue, useDoc, $root } from 'startupjs'
import { useAuthHelper } from '@startupjs/auth-local'
import { Span, Div, Button, Br } from '@startupjs/ui'
import { SIGN_IN_SLIDE, RECOVER_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import TextInput from '../TextInput'
import './index.styl'

export default observer(function ResetPasswordForm ({ secret, onSuccess, onChangeAuthPage }) {
  const authHelper = useAuthHelper()

  const _secret = secret || $root.get('$render.query.secret')

  const [form, $form] = useValue({})
  const [error, $error] = useValue()
  const [feedback, $feedback] = useValue()
  const [auth] = useQueryDoc('auths', { 'providers.local.passwordReset.secret': secret })
  const [user] = useDoc('users', _get(auth, 'id') || '_DUMMY_')

  function _onSuccess () {
    $feedback.set('Your password has been changed successfully.')
    onSuccess && onSuccess(user.id)
  }

  async function save () {
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
      const errorMsg = _get(error, 'response.data.message')
      if (errorMsg === 'reset password expired' && user) {
        $error.set('Link is expired.')
        return
      } else if (errorMsg === 'No user found by secret') {
        $error.set('Link is invalid.')
        return
      }
      $error.set(errorMsg)
    }
  }

  const onInputChange = name => value => {
    if (error) $error.del()
    $form.set({ ...$form.get(), [name]: value })
  }

  function onLogin () {
    onChangeAuthPage(SIGN_IN_SLIDE)
  }

  return pug`
    Div.root
      if !_secret
        Span.feedback= 'Please provide password reset secret'
      else
        Div.content
          if !feedback
            TextInput.input(
              onChangeText=onInputChange('password')
              label='Enter new password'
              name='password'
              placeholder='Password'
              secureTextEntry
              value=form.password || ''
            )
            Br
            TextInput.input(
              onChangeText=onInputChange('confirm')
              name='confirm'
              placeholder='Confirm'
              secureTextEntry
              value=form.confirm || ''
            )
            Div.error
              if error
                Span.errorMsg
                  = error
            Button.saveButton(
              variant='flat'
              color='primary'
              disabled=!form.confirm || !form.password
              onPress=save
            ) SAVE
          else
            Span.feedback= feedback
            Br
            Button(
              variant='flat'
              color='primary'
              onPress=onLogin
            ) Log in
  `
})
