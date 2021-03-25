import React from 'react'
import { Dimensions } from 'react-native'
import { observer, useOn, useValue } from 'startupjs'
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
  redirectUrl,
  slide,
  localForms,
  socialButtons,
  onSuccess,
  onError,
  onClose,
  onChangeSlide
}) {
  const isMobileWidth = width <= 480
  const [formData, $formData] = useValue(false)

  function _onClose () {
    $formData.set(false)
    onClose()
  }

  function onShow (props = {}) {
    $formData.set(props)
  }

  useOn('AuthModal.show', onShow)
  useOn('AuthModal.close', _onClose)

  return pug`
    Modal(
      $visible=$formData
      variant=isMobileWidth ? 'fullscreen' : 'window'
    )
      Modal.Header(style=styles.header)
      Div.content
        AuthForm(
          redirectUrl=redirectUrl || _get(formData, 'redirectUrl')
          localForms=localForms
          socialButtons=socialButtons
          onSuccess=onSuccess
          onError=onError
          onChangeSlide=onChangeSlide
          ...formData
          slide=slide
        )
  `
}

AuthModal.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  slide: PropTypes.string,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(AuthModal)
