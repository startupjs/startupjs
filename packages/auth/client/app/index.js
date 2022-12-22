import React from 'react'
import { emit, $root } from 'startupjs'
import { BASE_URL } from '@env'
import * as pages from './pages'
import {
  getAuthRoutes,
  SIGN_IN_SLIDE,
  SIGN_UP_SLIDE,
  RECOVER_PASSWORD_SLIDE,
  SIGN_IN_URL,
  SIGN_UP_URL,
  RECOVER_PASS_URL
} from '../../isomorphic'
import CommonLayout from './Layout'

export default function initAuthApp ({
  baseUrl = BASE_URL,
  redirectUrl,
  Layout = CommonLayout,
  localForms,
  socialButtons,
  renderForm,
  loggedInRedirectUrl,
  onChangeSlide,
  onSuccess,
  onError,
  onHandleError
}) {
  function _onChangeSlide (slide) {
    const search = $root.get('$render').search

    // for custom slide change event
    if (onChangeSlide) {
      return onChangeSlide(slide)
    }

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
  }

  const routes = getAuthRoutes(pages, { loggedInRedirectUrl }).map(item => {
    const Page = item.component
    item.component = () => {
      return pug`
        Page(
          baseUrl=baseUrl
          redirectUrl=redirectUrl
          localForms=localForms
          socialButtons=socialButtons
          renderForm=renderForm
          onChangeSlide=_onChangeSlide,
          onSuccess=onSuccess
          onError=onError
          onHandleError=onHandleError
        )
      `
    }
    return item
  })

  return { routes, Layout }
}
