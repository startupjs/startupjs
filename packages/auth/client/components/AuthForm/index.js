import React, { useState } from 'react'
import { View } from 'react-native'

import { observer, emit, useLocal } from 'startupjs'
import { H5, Content, Span } from '@startupjs/ui'
import { SIGN_IN_URL, SIGN_UP_URL, RECOVER_PASS_URL } from '@startupjs/auth/isomorphic'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import OrDivider from '../OrDivider'
import {
  DEFAULT_FORMS_CAPTIONS,
  DEFAULT_FORMS_DESCRIPTIONS,
  FORM_COMPONENTS_KEYS,
  SIGN_IN_SLIDE,
  SIGN_UP_SLIDE,
  RECOVER_PASSWORD_SLIDE
} from '../../../isomorphic'
import './index.styl'

function AuthForm ({
  baseUrl,
  configs,
  initSlide,
  socialButtons,
  localForms,
  hasRouting,
  redirectUrl,
  onSuccess,
  onError,
  onHandleError,
  onChangeAuthPage
}) {
  const [search = ''] = useLocal('$render.search')

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
        Component(
          baseUrl=baseUrl
          redirectUrl=redirectUrl
        )
    `
  })

  const needOrLine = renderSocialButtons && renderSocialButtons.length &&
    LocalActiveForm && [SIGN_IN_SLIDE, SIGN_UP_SLIDE].includes(activeSlide)

  function _onChangeAuthPage (slide) {
    // Catch case if we need update query params or do something else
    if (onChangeAuthPage && hasRouting) {
      onChangeAuthPage(slide)
    } else {
      if (hasRouting) {
        switch (slide) {
          case SIGN_IN_SLIDE:
            emit('url', SIGN_IN_URL + search)
            break
          case SIGN_UP_SLIDE:
            emit('url', SIGN_UP_URL + search)
            break
          case RECOVER_PASSWORD_SLIDE:
            emit('url', RECOVER_PASS_URL + search)
            break
          default:
            break
        }
      } else {
        setActiveSlide(slide)
      }
    }
  }

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
            config=config
            baseUrl=baseUrl
            redirectUrl=redirectUrl
            onSuccess=onSuccess
            onError=onError
            onHandleError=onHandleError
            onChangeAuthPage=_onChangeAuthPage
          )
  `
}

AuthForm.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  configs: PropTypes.object,
  initSlide: PropTypes.string,
  socialButtons: PropTypes.array,
  localForms: PropTypes.object,
  hasRouting: PropTypes.bool,
  redirectUrl: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeAuthPage: PropTypes.func
}

AuthForm.defaultProps = {
  baseUrl: BASE_URL,
  initSlide: SIGN_IN_SLIDE,
  socialButtons: [],
  hasRouting: false,
  onSuccess: null,
  onError: null,
  onHandleError: null
}

export default observer(AuthForm)
