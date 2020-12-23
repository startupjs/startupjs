import React from 'react'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { AuthForm, Logo } from '../../../components'
import { SIGN_UP_SLIDE } from '../../../../isomorphic'
import '../sharedPageStyles.styl'

function PSignUp ({
  configs,
  logo,
  localForms,
  socialButtons,
  redirectUrl,
  onError,
  onSuccess,
  onHandleError,
  onChangeAuthPage
}) {
  return pug`
    Div.root
      if logo
        Div.logo
          Logo(logo=logo)
      Div.wrapper
        AuthForm(
          configs=configs
          initSlide=SIGN_UP_SLIDE
          hasRouting=true
          localForms=localForms
          socialButtons=socialButtons
          redirectUrl=redirectUrl
          onError=onError
          onSuccess=onSuccess
          onHandleError=onHandleError
          onChangeAuthPage=onChangeAuthPage
        )
  `
}

PSignUp.propTypes = {
  configs: PropTypes.object,
  logo: PropTypes.node,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  redirectUrl: PropTypes.string,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeAuthPage: PropTypes.func
}

export default PSignUp
