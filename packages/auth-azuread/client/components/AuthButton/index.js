import React, { useState } from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useSession } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import qs from 'query-string'
import { BASE_URL } from '@env'
import { CALLBACK_NATIVE_AZUREAD_URL, SCOPE, getStrBase64 } from '../../../isomorphic'

function AuthButton ({ label }) {
  const baseUrl = BASE_URL
  const [authConfig] = useSession('auth')
  const [showModal, setShowModal] = useState(false)

  const { clientId, tentantId } = authConfig.azuread

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

  function onNavigationStateChange ({ url }) {
    if (url.includes(authConfig.successRedirectUrl)) {
      setShowModal(false)
      finishAuth()
    }
  }

  return pug`
    Button(
      icon=faMicrosoft
      variant='flat'
      onPress=showLoginModal
    )= label
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

AuthButton.defaultProps = {
  label: 'Login with Azure AD'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default observer(AuthButton)
