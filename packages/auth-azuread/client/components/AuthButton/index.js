import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useValue, useSession } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import moment from 'moment'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { AZUREAD_LOGIN_URL } from '../../../isomorphic'
import './index.styl'

function AuthButton ({
  style,
  baseUrl,
  redirectUrl,
  label
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
    Button.button(
      style=style
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
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
