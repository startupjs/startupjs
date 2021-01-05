import React from 'react'
import { observer, useValue } from 'startupjs'
import { Span, Div, Button, Br } from '@startupjs/ui'
import { RESET_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import { useAuthHelper } from '../../helpers'
import TextInput from '../TextInput'
import './index.styl'

export default observer(function ChangePasswordForm ({ onSuccess }) {
  const authHelper = useAuthHelper()

  const [form, $form] = useValue({})
  const [error, $error] = useValue()
  const [feedback, $feedback] = useValue()

  function _onSuccess () {
    $feedback.set('Your password has been changed successfully.')
    onSuccess && onSuccess(null, RESET_PASSWORD_SLIDE)
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

  const onInputChange = name => value => {
    if (error) $error.del()
    $form.set({ ...$form.get(), [name]: value })
  }

  return pug`
    Div.root
      Div.content
        if !feedback
          TextInput.input(
            onChangeText=onInputChange('oldPassword')
            label='Enter your old password'
            name='oldPassword'
            placeholder='Old password'
            secureTextEntry
            value=form.oldPassword || ''
          )
          Br
          TextInput.input(
            onChangeText=onInputChange('password')
            label='Enter your new password'
            name='password'
            placeholder='New Password'
            secureTextEntry
            value=form.password || ''
          )
          Br
          TextInput.input(
            onChangeText=onInputChange('confirm')
            name='confirm'
            placeholder='Confirm new password'
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
  `
})
