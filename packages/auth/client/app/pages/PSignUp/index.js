import React from 'react'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { AuthForm, Logo } from '../../../components'
import { SIGN_UP_SLIDE } from '../../../../isomorphic'
import '../sharedPageStyles.styl'

function PSignUp ({
  captions,
  descriptions,
  logo,
  localForms,
  socialButtons,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    Div.root
      if logo
        Div.logo
          Logo(logo=logo)
      Div.wrapper
        AuthForm(
          captions=captions
          descriptions=descriptions
          initSlide=SIGN_UP_SLIDE
          hasRouting=true
          localForms=localForms
          socialButtons=socialButtons
          onError=onError
          onSuccess=onSuccess
          onHandleError=onHandleError
        )
  `
}

PSignUp.propTypes = {
  captions: PropTypes.object,
  descriptions: PropTypes.object,
  logo: PropTypes.node,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PSignUp
