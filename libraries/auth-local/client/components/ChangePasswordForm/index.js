import React, { useState } from 'react'
import { pug, observer, useValue } from 'startupjs'
import { Alert, Br, Span, Div, Button, PasswordInput } from '@startupjs/ui'
import { RESET_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import { useAuthHelper } from '../../helpers'
import './index.styl'

export default observer(function ChangePasswordForm ({ baseUrl, onSuccess }) {
  const authHelper = useAuthHelper(baseUrl)

  const [form, $form] = useValue({})
  const [errors, $errors] = useValue({})
  const [feedback, setFeedback] = useState()

  function _onSuccess () {
    setFeedback('Your password has been changed successfully.')
    onSuccess && onSuccess(null, RESET_PASSWORD_SLIDE)
  }

  // TODO: to joi
  async function onSubmit () {
    $errors.setDiff({})

    if (!form.oldPassword) {
      $errors.set('oldPassword', 'Please fill old password')
      return
    }

    if (!form.password || form.password.length < 8) {
      $errors.set('password', 'Your password must be between 8 - 32 characters long')
      return
    }

    if (!form.confirm) {
      $errors.set('confirm', 'Please fill password confirmation')
      return
    }

    if (form.password !== form.confirm) {
      $errors.set('confirm', 'Passwords don\'t match')
      return
    }

    try {
      await authHelper.changePassword(form)
      _onSuccess()
    } catch (error) {
      const errorMsg = _get(error, 'response.data.message', error.message)
      $errors.set('common', errorMsg)
    }
  }

  const onInputChange = name => value => {
    if (errors[name]) $errors.del(name)
    $form.set({ ...$form.get(), [name]: value })
  }

  return pug`
    Div.content
      if !feedback
        if errors.common
          Alert(variant='error')= errors.common
          Br
        PasswordInput(
          label='Enter your old password'
          name='oldPassword'
          placeholder='Old password'
          value=form.oldPassword
          error=errors.oldPassword
          onChangeText=onInputChange('oldPassword')
        )
        PasswordInput.input(
          label='Enter your new password'
          name='password'
          placeholder='New Password'
          value=form.password
          error=errors.password
          onChangeText=onInputChange('password')
        )
        PasswordInput.input(
          name='confirm'
          placeholder='Confirm new password'
          value=form.confirm
          error=errors.confirm
          onChangeText=onInputChange('confirm')
        )
        Button.submit(
          variant='flat'
          color='primary'
          disabled=!form.confirm || !form.password
          onPress=onSubmit

        ) SAVE
      else
        Span.feedback= feedback
  `
})
