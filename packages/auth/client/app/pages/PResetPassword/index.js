import React from 'react'
import { observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { AuthForm, Logo } from '../../../components'
import { RESET_PASSWORD_SLIDE } from '../../../../isomorphic'
import '../sharedPageStyles.styl'

function PResetPassword ({
  configs,
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
          configs=configs
          initSlide=RESET_PASSWORD_SLIDE
          hasRouting=true
          localForms=localForms
          onError=onError
          onSuccess=onSuccess
          onHandleError=onHandleError
        )
  `
}

PResetPassword.propTypes = {
  configs: PropTypes.object,
  logo: PropTypes.node,
  localForms: PropTypes.object,
  socialButtons: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default observer(PResetPassword)
