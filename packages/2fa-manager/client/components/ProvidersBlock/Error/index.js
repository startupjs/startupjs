import React from 'react'
import { pug, observer } from 'startupjs'
import { Alert } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { MESSAGES } from './constants'

function Error ({ errorCode }) {
  return pug`
    Alert(variant='error')= MESSAGES[errorCode]
  `
}

Error.propTypes = {
  errorCode: PropTypes.string
}

export default observer(Error)
