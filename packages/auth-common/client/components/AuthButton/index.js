import React from 'react'
import { WebView } from 'react-native-webview'
import { Image } from 'react-native'
import { observer, u, useSession, useValue } from 'startupjs'
import { Modal, Span, Div } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import './index.styl'

function AuthButton ({
  style,
  label,
  baseUrl,
  providerName,
  imageUrl,
  redirectUrl
}) {
  const [authConfig] = useSession('auth')
  const config = authConfig[providerName]
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
    Div.button(
      style=style
      onPress=showLoginModal
    )
      if imageUrl
        Image.image(
          resizeMode='contain'
          source={ uri: imageUrl }
        )
      Span.label= label

    Modal(
      variant='fullscreen'
      $visible=$showModal
    )
      Div
        WebView(
          style={ height: u(100) }
          source={ uri: config.authorizationURL }
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          onNavigationStateChange=onNavigationStateChange
        )
  `
}

AuthButton.defaultProps = {
  label: 'Login',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  imageUrl: PropTypes.string,
  providerName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
