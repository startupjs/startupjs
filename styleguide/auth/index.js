import React from 'react'
import {
  LoginForm,
  RegisterForm,
  RecoverForm
} from '@startupjs/auth-local'
import { H5, Div } from '@startupjs/ui'
import { AuthButton as AppleAuthButton } from '@startupjs/auth-apple'
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread'
import { AuthButton as FacebookAuthButton } from '@startupjs/auth-facebook'
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin'
import { AuthButton as CommonAuthButton } from '@startupjs/auth-common'
import { AuthButton as IDGAuthButton } from '@startupjs/auth-idg'
import { BASE_URL } from '@env'
import Joi from '@hapi/joi'
import { initAuthApp } from '../../packages/auth'
import Layout from './Layout'
import './index.styl'

function getCaptionForm (slide) {
  if (slide === 'sign-in') return 'Авторизация'
  if (slide === 'sign-up') return 'Регистрация'
}

const registerForm = pug`
  RegisterForm(
    properties={
      name: null,
      age: {
        input: 'number',
        label: 'Age',
        placeholder: 'Enter your age'
      }
    }
    validateSchema={
      name: null,
      age: Joi.number().required().messages({
        'any.required': 'Fill in the field',
        'string.empty': 'Fill in the field'
      })
    }
  )
`

export default initAuthApp({
  Layout,
  redirectUrl: '/profile?customParam=dummy',
  loggedInRedirectUrl: '/profile?customParam=dummy',
  localForms: {
    'sign-in': pug`
      LoginForm
    `,
    'sign-up': registerForm,
    recover: pug`
      RecoverForm
    `
  },

  socialButtons: [
    <AppleAuthButton key='apple-btn' />,
    <AzureadAuthButton key='azure-btn' />,
    <FacebookAuthButton key='fb-btn' />,
    <GoogleAuthButton key='google-btn' />,
    <LinkedinAuthButton key='linkedin-btn' />,
    <CommonAuthButton
      key='virign-btn'
      label='Virgin'
      providerName='virgin'
      style={{ backgroundColor: '#e1090d' }}
      imageUrl={BASE_URL + '/img/virgin.png'}
    />,
    <IDGAuthButton key='idg-btn' />
  ],

  renderForm: function ({
    slide,
    socialButtons,
    localActiveForm,
    onChangeSlide
  }) {
    return pug`
      Div.form
        H5.caption= getCaptionForm(slide)
        = socialButtons
        Div.case= localActiveForm
    `
  }
})
