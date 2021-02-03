import React from 'react'
import { u } from 'startupjs'
import { Row, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { onLogin } from '../../helpers'
import IDG from './img/IDG.svg'
import './index.styl'

function AuthButton ({ label, redirectUrl }) {
  return pug`
    Row.button(onPress=() => onLogin(redirectUrl))
      IDG(
        viewBox="2 4 40 40"
        height=u(2)
        width=u(2)
      )
      Span.label= label
  `
}

AuthButton.defaultProps = {
  label: 'IDG'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default AuthButton
