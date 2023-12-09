import React from 'react'
import { pug, observer } from 'startupjs'
import { Content, Div, Span } from '@startupjs/ui'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import OrDivider from '../OrDivider'
import {
  DEFAULT_FORMS_CAPTIONS,
  DEFAULT_FORMS_DESCRIPTIONS,
  SIGN_IN_SLIDE,
  SIGN_UP_SLIDE
} from '../../../isomorphic'
import './index.styl'

function AuthForm ({
  baseUrl,
  redirectUrl,
  slide,
  socialButtons,
  localForms,
  renderForm,
  onSuccess,
  onError,
  onHandleError,
  onChangeSlide
}) {
  const localActiveForm = localForms ? localForms[slide] : null

  const prepereSocialButtons = socialButtons.map((component, index) => {
    const prepereButton = React.cloneElement(component, {
      baseUrl,
      redirectUrl,
      ...component.props
    })

    return pug`
      Div.button(key=index)= prepereButton
    `
  })

  const isNeedOrLine = prepereSocialButtons && localActiveForm &&
    [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(slide)

  let prepereLocalActiveForm = null
  if (localActiveForm) {
    prepereLocalActiveForm = React.cloneElement(localActiveForm, {
      baseUrl,
      redirectUrl,
      onSuccess,
      onError,
      onHandleError,
      onChangeSlide,
      ...localActiveForm.props
    })
  }

  if (renderForm) {
    return renderForm({
      slide,
      socialButtons: pug`
        Div.buttons(row)= prepereSocialButtons
      `,
      localActiveForm: prepereLocalActiveForm
    })
  }

  return pug`
    Content
      if localActiveForm
        Span.caption= DEFAULT_FORMS_CAPTIONS[slide]

        Span.description(description)
          = DEFAULT_FORMS_DESCRIPTIONS[slide]

      if [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(slide)
        Div.buttons(row)
          = prepereSocialButtons

      if isNeedOrLine
        OrDivider

      if localActiveForm
        Div.form
          = prepereLocalActiveForm
  `
}

AuthForm.propTypes = {
  baseUrl: PropTypes.string,
  redirectUrl: PropTypes.string,
  slide: PropTypes.string,
  socialButtons: PropTypes.array,
  localForms: PropTypes.object,
  renderForm: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

AuthForm.defaultProps = {
  baseUrl: BASE_URL,
  slide: SIGN_IN_SLIDE,
  localForms: {},
  socialButtons: [],
  renderForm: null,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
