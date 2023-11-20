import React from 'react'
import { WebView } from 'react-native-webview'
import { Image } from 'react-native'
import { pug, observer, u, useValue, useSession } from 'startupjs'
import { Modal, Span, Div } from '@startupjs/ui'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import moment from 'moment'
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
  const [, $showModal] = useValue(false)
  const [authConfig] = useSession('auth')
  const { expiresRedirectUrl } = authConfig

  async function showLoginModal () {
    if (redirectUrl) {
      await CookieManager.set({
        baseUrl,
        name: 'authRedirectUrl',
        value: redirectUrl,
        expires: moment().add(expiresRedirectUrl, 'milliseconds')
      })
    }

    $showModal.set(true)
  }

  function onNavigationStateChange ({ url }) {
    if (url.includes(baseUrl) && !url.includes('auth')) {
      $showModal.set(false)
      setTimeout(() => clientFinishAuth(url.replace(baseUrl, '')), 100)
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
          source={ uri: baseUrl + '/auth/' + providerName }
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
  redirectUrl: PropTypes.string,
  providerName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
