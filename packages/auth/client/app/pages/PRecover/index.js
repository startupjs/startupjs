import React from 'react'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { AuthForm, Logo } from '../../../components'
import '../sharedPageStyles.styl'

function PRecover ({
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
          initSlide='recover'
          hasRouting=true
          localForms=localForms
          socialButtons=socialButtons
          onError=onError
          onSuccess=onSuccess
          onHandleError=onHandleError
      )
  `
}

PRecover.propTypes = {
  captions: PropTypes.object,
  descriptions: PropTypes.object,
  logo: PropTypes.node,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PRecover
