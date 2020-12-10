import React, { useState } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { H3, Content, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import OrDivider from '../OrDivider'
import { DEFAULT_FORMS_CAPTIONS, FORM_COMPONENTS_KEYS, SIGN_IN_SLIDE, SIGN_UP_SLIDE } from '../../../isomorphic'
import './index.styl'

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
  const LocalActiveForm = localForms ? localForms[FORM_COMPONENTS_KEYS[activeSlide]] : null

  const _captions = Object.assign(DEFAULT_FORMS_CAPTIONS, captions)
  const currentCaption = _captions[activeSlide]

  const _descriptions = Object.assign(DESCRIPTIONS, descriptions)
  const currentDescription = _descriptions[activeSlide]

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
        if typeof currentCaption === 'string'
          H3.caption= currentCaption
        else
          = currentCaption
        if currentDescription
          Span(description).description= currentDescription

      if activeSlide !== 'recover'
        = renderSocialButtons

      if needOrLine
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
  initSlide: SIGN_IN_SLIDE,
  socialButtons: [],
  hasRouting: false,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
