import React from 'react'
import { observer, useValue } from 'startupjs'
import { useAuthHelper } from '@startupjs/auth-local'
import { Span, Div, TextInput, Button } from '@startupjs/ui'
import _get from 'lodash/get'
import './index.styl'

export default observer(function ChangePasswordForm ({ onSuccess }) {
  const authHelper = useAuthHelper()

  const [form, $form] = useValue({})
  const [error, $error] = useValue()
  const [feedback, $feedback] = useValue()

  function _onSuccess () {
    $feedback.set('Your password has been changed successfully.')
    onSuccess && onSuccess()
  }

  async function save () {
    if (!form.oldPassword) {
      $error.set('Please fill old password')
      return
    }

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
      await authHelper.changePassword(form)

      _onSuccess()
    } catch (error) {
      const errorMsg = _get(error, 'response.data.message')
      $error.set(errorMsg)
    }
  }

  const onInputChange = name => ({ target: { value } }) => {
    if (error) $error.del()
    $form.set({ ...$form.get(), [name]: value })
  }

  return pug`
    Div.root
      Div.content
        if !feedback
          Span.header-text Update password
          TextInput.input(
            label='Enter your old password'
            value=form.oldPassword
            onChange=onInputChange('oldPassword')
            placeholder='Old password'
            secureTextEntry
          )
          TextInput.input(
            label='Enter your new password'
            value=form.password
            onChange=onInputChange('password')
            placeholder='New Password'
            secureTextEntry
          )
          TextInput.input(
            value=form.confirm
            onChange=onInputChange('confirm')
            placeholder='Confirm new password'
            secureTextEntry
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
  `
})
