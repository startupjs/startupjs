import React from 'react'
import { observer } from 'startupjs'
import { Row, H5, Content, Div, Span } from '@startupjs/ui'
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
    return pug`
      Div.button(key=index)
        = component
    `
  })

  const isNeedOrLine = prepereSocialButtons && localActiveForm &&
    [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(slide)

  let prepereLocalActiveForm = null
  if (localActiveForm) {
    prepereLocalActiveForm = React.cloneElement(localActiveForm, {
      ...localActiveForm.props,
      onSuccess,
      onError,
      onHandleError,
      onChangeSlide
    })
  }

  if (renderForm) {
    return renderForm({
      slide,
      socialButtons: pug`
        Row.buttons= prepereSocialButtons
      `,
      localActiveForm: prepereLocalActiveForm
    })
  }

  return pug`
    Content
      if localActiveForm
        H5.caption= DEFAULT_FORMS_CAPTIONS[slide]

        Span.description(variant='description')
          = DEFAULT_FORMS_DESCRIPTIONS[slide]

      if [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(slide)
        Row.buttons
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
