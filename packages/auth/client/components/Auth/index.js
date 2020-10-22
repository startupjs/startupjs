import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ScrollView } from 'react-native'
import { Span } from '@startupjs/ui'

function Auth ({ children }) {
  return pug`
    ScrollView
      = children
  `
}

export default Auth
