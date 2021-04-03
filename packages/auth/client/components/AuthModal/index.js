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
  onChangeSlide,
  renderForm
}) {
  const isMobileWidth = width <= 480
  const [modalData, $modalData] = useValue(false)

  function _onClose () {
    $modalData.set(false)
    onClose()
  }

  function onShow (props = {}) {
    $modalData.set(props)
  }

  useOn('AuthModal.show', onShow)
  useOn('AuthModal.close', _onClose)

  return pug`
    Modal(
      $visible=$modalData
      variant=isMobileWidth ? 'fullscreen' : 'window'
    )
      Modal.Header(style=styles.header)
      Div.content
        AuthForm(
          redirectUrl=redirectUrl || _get(modalData, 'redirectUrl')
          localForms=localForms
          socialButtons=socialButtons
          renderForm=renderForm
          onSuccess=onSuccess
          onError=onError
          onChangeSlide=onChangeSlide
          ...modalData
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
  renderForm: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
  onChangeSlide: PropTypes.func
}

export default observer(AuthModal)
