import React from 'react'
import { AuthForm } from '../../../components'
import PropTypes from 'prop-types'

function PRecover ({
  components,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    AuthForm(
      initSlide='recover'
      hasRouting=true
      components=components
      onError=onError
      onSuccess=onSuccess
      onHandleError=onHandleError
    )
  `
}

PRecover.propTypes = {
  components: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHandleError: PropTypes.func
}

export default PRecover
