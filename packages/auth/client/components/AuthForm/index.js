import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { H5, Content, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import OrDivider from '../OrDivider'
import {
  DEFAULT_FORMS_CAPTIONS,
  DEFAULT_FORMS_DESCRIPTIONS,
  FORM_COMPONENTS_KEYS,
  SIGN_IN_SLIDE,
  SIGN_UP_SLIDE
} from '../../../isomorphic'
import './index.styl'

function AuthForm ({
  configs,
  initSlide,
  socialButtons,
  localForms,
  hasRouting,
  onSuccess,
  onError,
  onHandleError
}) {
  const [activeSlide, setActiveSlide] = useState(initSlide)
  const LocalActiveForm = localForms ? localForms[FORM_COMPONENTS_KEYS[activeSlide]] : null

  // Config with titles, texts, custom components etc.
  const config = _get(configs, activeSlide, {})

  const caption = config.title || DEFAULT_FORMS_CAPTIONS[activeSlide]
  const description = config.description || DEFAULT_FORMS_DESCRIPTIONS[activeSlide]
  const localFormDescription = config.localFormDescription

  const renderSocialButtons = socialButtons.map((Component, index) => {
    return pug`
      View.button(key=index)
        Component
    `
  })

  const needOrLine = renderSocialButtons && renderSocialButtons.length &&
    LocalActiveForm && [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(activeSlide)

  return pug`
    Content
      if LocalActiveForm
        if typeof caption === 'string'
          H5.caption= caption
        else
          = caption

        if typeof description === 'string'
          Span.description(variant='description')= description
        else
          = description

      if [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(activeSlide)
        View.buttons
          = renderSocialButtons

      if needOrLine
        OrDivider

      if LocalActiveForm
        View.form
          if typeof localFormDescription === 'string'
            Span.description(variant='description')= localFormDescription
          else
            = localFormDescription
          LocalActiveForm(
            onSuccess=onSuccess
            onError=onError
            onHandleError=onHandleError
            onChangeAuthPage=hasRouting ? null : setActiveSlide
          )
  `
}

AuthForm.propTypes = {
  configs: PropTypes.object,
  initSlide: PropTypes.string,
  socialButtons: PropTypes.array,
  localForms: PropTypes.object,
  hasRouting: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

AuthForm.defaultProps = {
  initSlide: SIGN_IN_SLIDE,
  socialButtons: [],
  hasRouting: false,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
