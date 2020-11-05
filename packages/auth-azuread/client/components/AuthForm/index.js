import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { Modal, Div, Button } from '@startupjs/ui'
import { WebView } from 'react-native-webview'
import { observer, u, useSession } from 'startupjs'
import qs from 'query-string'
import { CALLBACK_NATIVE_AZUREAD_URL, SCOPE, getStrBase64 } from '../../../isomorphic'
import { DEFAUL_SUCCESS_REDIRECT_URL } from '@startupjs/auth/isomorphic'
import { finishAuth } from '@startupjs/auth'

function AuthForm ({ text }) {
  const [baseUrl] = useSession('env.BASE_URL')
  const [config] = useSession('auth.azuread')
  const [showModal, setShowModal] = useState(false)

  const { clientId, tentantId } = config

  function showLoginModal () {
    setShowModal(true)
  }

  function getAuthorizationUrl () {
    return `https://login.microsoftonline.com/${tentantId}/oauth2/v2.0/authorize?${qs.stringify({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: baseUrl + CALLBACK_NATIVE_AZUREAD_URL,
      scope: SCOPE,
      response_mode: 'query',
      prompt: 'login',
      code_challenge: getStrBase64(`${clientId}_${tentantId}`),
      code_challenge_method: 'plain'
    })}`
  }

  console.log(getAuthorizationUrl())

  function onNavigationStateChange ({ url }) {
    if (url.includes(DEFAUL_SUCCESS_REDIRECT_URL)) {
      finishAuth()
    }
  }
  return pug`
    Button(
      icon=faMicrosoft
      variant='flat'
      onPress=showLoginModal
    )= text
    Modal(
      variant='fullscreen'
      visible=showModal
    )
      Div.modal
        WebView(
          style={ height: u(100) }
          source={ uri: getAuthorizationUrl() }

          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled

          onNavigationStateChange=onNavigationStateChange
        )
  `
}

AuthForm.defaultProps = {
  text: 'Login with Azure AD'
}

AuthForm.propTypes = {
  text: PropTypes.string.isRequired
}

export default observer(AuthForm)
