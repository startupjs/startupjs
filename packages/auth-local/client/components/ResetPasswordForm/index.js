import React from 'react'
import { observer, useQueryDoc, useValue, useDoc } from 'startupjs'
import { Span, Div, TextInput, Button } from '@startupjs/ui'
import { BASE_URL } from '@env'
import axios from 'axios'
import _get from 'lodash/get'
import { RESET_PASSWORD_URL } from '../../../isomorphic'
import './index.styl'

export default observer(function ResetPasswordForm ({ secret, onSuccess }) {
  const baseUrl = BASE_URL

  const [form, $form] = useValue({})
  const [error, $error] = useValue()
  const [feedback, setFeedback] = useValue()
  const [auth] = useQueryDoc('auths', { 'providers.local.passwordReset.secret': secret })
  const [user] = useDoc('users', _get(auth, 'id') || '_DUMMY_')

  function _onSuccess () {
    setFeedback('Your password has been changed successfully.')
    onSuccess && onSuccess(user.id)
  }

  async function save () {
    if (!form.password || form.password.length < 8) {
      $error.set('Your password must be between 8 - 32 characters long')
      return
    }

    try {
      await axios.post(baseUrl + RESET_PASSWORD_URL, {
        secret,
        password: form.password,
        confirm: form.confirm
      })
      _onSuccess()
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

  const onInputChange = name => ({ target: { value } }) => {
    if (error) $error.del()
    $form.set({ ...$form.get(), [name]: value })
  }

  return pug`
    Div.root
      Div.content
        if !feedback
          Span.header-text Enter your new password
          TextInput.input(
            value=form.password
            onChange=onInputChange('password')
            placeholder='Password'
            secureTextEntry
          )
          TextInput.input(
            value=form.confirm
            onChange=onInputChange('confirm')
            placeholder='Confirm'
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
