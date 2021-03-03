import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useValue } from 'startupjs'
import { Modal, Row, Span } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import { BASE_URL } from '@env'
import PropTypes from 'prop-types'
import { LOGIN_URL } from '../../../isomorphic'
import IDG from './img/IDG.svg'
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
    Row.button(onPress=showLoginModal)
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
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
