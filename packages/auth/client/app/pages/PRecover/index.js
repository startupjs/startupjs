import React from 'react'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { AuthForm, Logo } from '../../../components'
import '../sharedPageStyles.styl'

function PRecover ({
  baseUrl,
  configs,
  logo,
  localForms,
  socialButtons,
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
          initSlide='recover'
          hasRouting=true
          localForms=localForms
          socialButtons=socialButtons
          onError=onError
          onSuccess=onSuccess
          onHandleError=onHandleError
          onChangeAuthPage=onChangeAuthPage
      )
  `
}

PRecover.propTypes = {
  baseUrl: PropTypes.string,
  configs: PropTypes.object,
  logo: PropTypes.node,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func,
  onChangeAuthPage: PropTypes.func
}

export default PRecover
