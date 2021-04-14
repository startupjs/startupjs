import React, { useState } from 'react'
import { observer, useValue } from 'startupjs'
import { Span, Div, Button, PasswordInput, ErrorWrapper } from '@startupjs/ui'
import { RESET_PASSWORD_SLIDE } from '@startupjs/auth/isomorphic'
import _get from 'lodash/get'
import { useAuthHelper } from '../../helpers'
import './index.styl'

export default observer(function ChangePasswordForm ({ baseUrl, onSuccess }) {
  const authHelper = useAuthHelper(baseUrl)

  const [form, $form] = useValue({})
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  function _onSuccess () {
    setFeedback('Your password has been changed successfully.')
    onSuccess && onSuccess(null, RESET_PASSWORD_SLIDE)
  }

  // TODO: to joi
  async function onSubmit () {
    if (!form.oldPassword) {
      setError('Please fill old password')
      return
    }

    if (!form.password || form.password.length < 8) {
      setError('Your password must be between 8 - 32 characters long')
      return
    }

    if (!form.confirm) {
      setError('Please fill password confirmation')
      return
    }

    if (form.password !== form.confirm) {
      setError('Password should match confirmation')
      return
    }

    try {
      await authHelper.changePassword(form)

      _onSuccess()
    } catch (error) {
      const errorMsg = _get(error, 'response.data.message', error.message)
      setError(errorMsg)
    }
  }

  const onInputChange = name => value => {
    if (error) setError('')
    $form.set({ ...$form.get(), [name]: value })
  }

  return pug`
    Div.content
      if !feedback
        PasswordInput(
          label='Enter your old password'
          name='oldPassword'
          placeholder='Old password'
          value=form.oldPassword || ''
          onChangeText=onInputChange('oldPassword')
        )
        PasswordInput.input(
          label='Enter your new password'
          name='password'
          placeholder='New Password'
          value=form.password || ''
          onChangeText=onInputChange('password')
        )
        PasswordInput.input(
          name='confirm'
          placeholder='Confirm new password'
          value=form.confirm || ''
          onChangeText=onInputChange('confirm')
        )

        ErrorWrapper(err=error)

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
