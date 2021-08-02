import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useValue, useSession } from 'startupjs'
import { Modal, Row, Span } from '@startupjs/ui'
import { clientFinishAuth, CookieManager } from '@startupjs/auth'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import moment from 'moment'
import { LOGIN_URL } from '../../../isomorphic'
import IDG from './img/IDG.svg'
import './index.styl'

function AuthButton ({
  style,
  label,
  baseUrl,
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
    Row.button(
      style=style
      onPress=showLoginModal
    )
      IDG(
        viewBox="2 4 40 40"
        height=u(2)
        width=u(2)
      )
      Span.label= label

    Modal(
      variant='fullscreen'
      $visible=$showModal
    )
      WebView(
        style={ height: u(100) }
        source={ uri: baseUrl + LOGIN_URL }
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        onNavigationStateChange=onNavigationStateChange
      )
  `
}

AuthButton.defaultProps = {
  label: 'IDG',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
