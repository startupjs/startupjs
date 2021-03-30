import React from 'react'
import { Dimensions } from 'react-native'
import { observer, useOn, useLocal, useValue } from 'startupjs'
import { Modal, Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import AuthForm from '../AuthForm'
import styles from './index.styl'

const { width } = Dimensions.get('window')

// Pages: 'sign-in', 'sign-up', 'recover', 'reset-password'
// @startupjs/auth/isomorphic/constants.js - slides constants

/**
 * @example
 * import { showAuthModal } from 'clientHelpers'
 * ...
 * ...
 * emit('AuthModal.show', {
 *   page: RECOVER_PASSWORD_SLIDE,
 *   redirectUrl,
 * })
 */
function AuthModal ({
  baseUrl,
  localForms,
  socialButtons,
  onSuccess,
  onError,
  onClose,
  renderForm
}) {
  const isMobileWidth = width <= 480
  const [_redirectUrl] = useLocal('$render.query.redirectUrl')
  const [modal, $modal] = useValue(false)

  function _onClose () {
    $modal.set(false)
    onClose()
  }

  function onShow (props = {}) {
    $modal.set(props)
  }

  useOn('AuthModal.show', onShow)
  useOn('AuthModal.close', _onClose)

  return pug`
    Modal(
      $visible=$modal
      variant=isMobileWidth ? 'fullscreen' : 'window'
    )
      Modal.Header(style=styles.header)
      Div.content
        AuthForm(
          redirectUrl=_get(modal, 'redirectUrl') || _redirectUrl
          localForms=localForms
          socialButtons=socialButtons
          renderForm=renderForm
          onSuccess=onSuccess
          onError=onError
          onChangeSlide=slide=> $modal.set('slide', slide)
          ...modal
        )
  `
}

AuthModal.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  renderForm: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func
}

export default observer(AuthModal)
