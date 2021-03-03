import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useValue } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { LINKEDIN_WEB_LOGIN_URL } from '../../../isomorphic'
import './index.styl'

function AuthButton ({ baseUrl, label }) {
  const [, $showModal] = useValue(false)

  function showLoginModal () {
    $showModal.set(true)
  }

  function onNavigationStateChange ({ url }) {
    if (url.includes(baseUrl) && !url.includes('auth')) {
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
  label: 'LinkedIn',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
