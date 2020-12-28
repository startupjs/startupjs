import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useSession, useValue } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { LINKEDIN_WEB_LOGIN_URL } from '../../../isomorphic'
import './index.styl'

function AuthButton ({ label }) {
  const baseUrl = BASE_URL
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
      icon=faLinkedinIn
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
          source={ uri: baseUrl + LINKEDIN_WEB_LOGIN_URL }
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          onNavigationStateChange=onNavigationStateChange
        )
  `
}

AuthButton.defaultProps = {
  label: 'LinkedIn'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default observer(AuthButton)
