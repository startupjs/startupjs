import React from 'react'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { AuthForm, Logo } from '../../../components'
import { SIGN_IN_SLIDE } from '../../../../isomorphic'
import '../sharedPageStyles.styl'

function PSignIn ({
  baseUrl,
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
          baseUrl=baseUrl
          configs=configs
          initSlide=SIGN_IN_SLIDE
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

PSignIn.propTypes = {
  baseUrl: PropTypes.string,
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

export default PSignIn
