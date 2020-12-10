import React, { useState } from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useSession } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import PropTypes from 'prop-types'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import qs from 'query-string'
// import { BASE_URL } from '@env'
import { CALLBACK_NATIVE_URL, AUTHORIZATION_URL } from '../../../isomorphic'
import './index.styl'

function AuthButton ({ style, label }) {
  // const baseUrl = BASE_URL
  const [authConfig] = useSession('auth')
  const [showModal, setShowModal] = useState(false)

  const { clientId } = authConfig.apple

  function showLoginModal () {
    setShowModal(true)
  }

  function getAuthorizationUrl () {
    return `${AUTHORIZATION_URL}?${qs.stringify({
      client_id: clientId,
      scope: 'name email',
      response_type: 'code',
      response_mode: 'form_post',
      redirect_uri: 'https://7f2183d284ab.ngrok.io' + CALLBACK_NATIVE_URL
    })}`
  }

  function onNavigationStateChange ({ url }) {
    if (url.includes(authConfig.successRedirectUrl)) {
      setShowModal(false)
      finishAuth()
    }
  }

  return pug`
    Button.button(
      style=style
      icon=faApple
      variant='flat'
      onPress=showLoginModal
    )= label
    Modal(variant='fullscreen' visible=showModal)
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
  label: 'Login with Apple'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default observer(AuthButton)
