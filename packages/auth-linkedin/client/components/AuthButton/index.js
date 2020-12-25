import React from 'react'
import { WebView } from 'react-native-webview'
import { observer, u, useSession, useValue } from 'startupjs'
import { Modal, Div, Button } from '@startupjs/ui'
import { finishAuth } from '@startupjs/auth'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import qs from 'query-string'
import { BASE_URL } from '@env'
import { CALLBACK_LINKEDIN_URL, AUTHORIZATION_URL } from '../../../isomorphic'
import './index.styl'

function AuthButton ({ label }) {
  const baseUrl = BASE_URL
  const [authConfig] = useSession('auth')
  const [, $showModal] = useValue(false)

  const { clientId } = authConfig.linkedin

  function showLoginModal () {
    $showModal.set(true)
  }

  function getAuthorizationUrl () {
    return `${AUTHORIZATION_URL}?${qs.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: 'r_emailaddress r_liteprofile',
      redirect_uri: baseUrl + CALLBACK_LINKEDIN_URL
    })}`
  }

  function onNavigationStateChange ({ url }) {
    if (url.includes(authConfig.successRedirectUrl)) {
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
  label: 'LinkedIn'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default observer(AuthButton)
