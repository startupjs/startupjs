import React, { useState } from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useLocal } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import PropTypes from 'prop-types'
import axios from 'axios'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import qs from 'query-string'
import { BASE_URL } from '@env'
import {
  AUTHORIZATION_URL,
  CALLBACK_NATIVE_URL,
  CALLBACK_NATIVE_FINISH_URL
} from '../../../isomorphic'
import './index.styl'

function AuthButton ({ style, label }) {
  const baseUrl = BASE_URL
  const [session] = useLocal('_session')
  const [showModal, setShowModal] = useState(false)

  const { clientId } = session.auth.apple

  function showLoginModal () {
    setShowModal(true)
  }

  function getAuthorizationUrl () {
    return `${AUTHORIZATION_URL}?${qs.stringify({
      client_id: clientId,
      scope: 'name email',
      response_type: 'code',
      response_mode: 'form_post',
      redirect_uri: baseUrl + CALLBACK_NATIVE_URL
    })}`
  }

  async function onNavigationStateChange ({ url }) {
    if (url.includes('/auth/sing-in?apple=1')) {
      const data = qs.parse(url)

      setShowModal(false)
      await axios.post(CALLBACK_NATIVE_FINISH_URL, {
        iv: data.iv,
        content: data.content
      })
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
