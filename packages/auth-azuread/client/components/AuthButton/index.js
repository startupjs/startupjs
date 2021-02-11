import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useSession, useValue } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { AZUREAD_LOGIN_URL } from '../../../isomorphic'
import './index.styl'

function AuthButton ({ baseUrl, label }) {
  const [authConfig] = useSession('auth')
  const [, $showModal] = useValue(false)

  function showLoginModal () {
    $showModal.set(true)
  }

  function onNavigationStateChange ({ url }) {
    if (url === (baseUrl + authConfig.successRedirectUrl)) {
      $showModal.set(false)
      finishAuth()
    }
  }

  return pug`
    Button.button(
      icon=faMicrosoft
      variant='flat'
      onPress=showLoginModal
    )= label
    Modal(
      variant='fullscreen'
      $visible=$showModal
    )
      Div.modal
        WebView(
          style={ height: u(100) }
          source={ uri: baseUrl + AZUREAD_LOGIN_URL }
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          onNavigationStateChange=onNavigationStateChange
        )
  `
}

AuthButton.defaultProps = {
  label: 'Azure AD',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
