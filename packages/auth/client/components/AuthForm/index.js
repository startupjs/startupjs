import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { H3, Content, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

const CAPTIONS = {
  'sign-in': 'Sign In',
  'sign-up': 'Sign Up',
  recover: 'Forgot password'
}

const LOCAL_COMPONENTS = {
  'sign-in': 'LoginForm',
  'sign-up': 'RegisterForm',
  recover: 'RecoverForm'
}

function AuthForm ({
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

  const renderSocialButtons = socialButtons.map(Component => {
    return pug`
      View.button
        Component
    `
  })

  console.log(activeSlide)

  return pug`
    Content
      if LocalActiveForm
        H3.caption= CAPTIONS[activeSlide]
        Span.desc

      if activeSlide !== 'recover'
        = renderSocialButtons

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
  initSlide: PropTypes.string,
  socialButtons: PropTypes.object,
  localForms: PropTypes.object,
  hasRouting: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

AuthForm.defaultProps = {
  initSlide: 'sign-in',
  socialButtons: {},
  hasRouting: false,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
