import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { Modal, Div, Button } from '@startupjs/ui'
import { WebView } from 'react-native-webview'
import { observer, u, useSession } from 'startupjs'
import qs from 'query-string'
import { CALLBACK_NATIVE_LINKEDIN_URL } from '../../../isomorphic'
import { DEFAUL_SUCCESS_REDIRECT_URL } from '@startupjs/auth/isomorphic'
import { finishAuth } from '@startupjs/auth'

const AUTHORIZATION_URL = 'https://www.linkedin.com/oauth/v2/authorization'

function AuthForm ({ text }) {
  const [baseUrl] = useSession('env.BASE_URL')
  const [clientId] = useSession('auth.linkedin.clientId')
  const [showModal, setShowModal] = useState(false)

  function showLoginModal () {
    setShowModal(true)
  }

  function getAuthorizationUrl () {
    return `${AUTHORIZATION_URL}?${qs.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: 'r_emailaddress r_liteprofile',
      redirect_uri: baseUrl + CALLBACK_NATIVE_LINKEDIN_URL
    })}`
  }

  function onNavigationStateChange ({ url }) {
    if (url.includes(DEFAUL_SUCCESS_REDIRECT_URL)) {
      finishAuth()
    }
  }
  return pug`
    Button(
      icon=faLinkedinIn
      variant='flat'
      onPress=showLoginModal
    )= text
    Modal(
      variant='fullscreen'
      visible=showModal
    )
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

AuthForm.defaultProps = {
  text: 'Login with LinkedIn'
}

AuthForm.propTypes = {
  text: PropTypes.string.isRequired
}

export default observer(AuthForm)
