import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { H3, Content, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import OrDivider from '../OrDivider'
import './index.styl'

const CAPTIONS = {
  'sign-in': 'Sign In',
  'sign-up': 'Sign Up',
  recover: 'Forgot password?',
  'reset-password': 'Reset password'
}

const LOCAL_COMPONENTS = {
  'sign-in': 'LoginForm',
  'sign-up': 'RegisterForm',
  recover: 'RecoverForm',
  'reset-password': 'ResetPasswordForm'
}

const DESCRIPTIONS = {}

function AuthForm ({
  captions,
  descriptions,
  initSlide,
  socialButtons,
  localForms,
  hasRouting,
  onSuccess,
  onError,
  onHandleError
}) {
  const [activeSlide, setActiveSlide] = useState(initSlide)
  const LocalActiveForm = localForms ? localForms[LOCAL_COMPONENTS[activeSlide]] : null

  const _captions = Object.assign(CAPTIONS, captions)
  const currentCaption = _captions[activeSlide]

  const _descriptions = Object.assign(DESCRIPTIONS, descriptions)
  const currentDescription = _descriptions[activeSlide]

  const renderSocialButtons = socialButtons.map((Component, index) => {
    return pug`
      View.button(key=index)
        Component
    `
  })

  return pug`
    Content
      if LocalActiveForm
        if typeof currentCaption === 'string'
          H3.caption= currentCaption
        else
          = currentCaption
        if currentDescription
          Span(description).description= currentDescription

      if activeSlide !== 'recover'
        = renderSocialButtons

      // FIXME: ref this line
      if renderSocialButtons && renderSocialButtons.length && LocalActiveForm && ['sign-in', 'sign-up'].includes(activeSlide)
        OrDivider

      if LocalActiveForm
        View.form
          LocalActiveForm(
            onSuccess=onSuccess
            onError=onError
            onHandleError=onHandleError
            onChangeAuthPage=hasRouting ? null : setActiveSlide
          )
  `
}

AuthForm.propTypes = {
  captions: PropTypes.object,
  descriptions: PropTypes.object,
  initSlide: PropTypes.string,
  socialButtons: PropTypes.array,
  localForms: PropTypes.object,
  hasRouting: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

AuthForm.defaultProps = {
  initSlide: 'sign-in',
  socialButtons: [],
  hasRouting: false,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
