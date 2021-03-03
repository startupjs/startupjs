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
  slide,
  localForms,
  socialButtons,
  onSuccess,
  onError,
  onChangeSlide
}) {
  const isMobileWidth = width <= 480
  const [_redirectUrl] = useLocal('$render.query.redirectUrl')
  const [modal, $modal] = useValue(false)

  function onClose () {
    $modal.set(false)
  }

  function onShow (props = {}) {
    $modal.set(props)
  }

  useOn('AuthModal.show', onShow)
  useOn('AuthModal.close', onClose)

  return pug`
    Modal(
      $visible=$modal
      variant=isMobileWidth ? 'fullscreen' : 'window'
    )
      Modal.Header(style=styles.header)
      Div.content
        AuthForm(
          slide=slide
          redirectUrl=_get(modal, 'redirectUrl') || _redirectUrl
          localForms=localForms
          socialButtons=socialButtons
          onSuccess=onSuccess
          onError=onError
          onChangeSlide=onChangeSlide
          ...modal
        )
  `
}

AuthModal.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  slide: PropTypes.string,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(AuthModal)
