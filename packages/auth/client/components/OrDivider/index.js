import React from 'react'
import { pug, observer } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

function OrDivider ({ label = 'or' }) {
  return pug`
    Div.root
      Div.line.left
      Span.text= label
      Div.line.right
  `
}

OrDivider.propTypes = {
  label: PropTypes.string
}

export default observer(OrDivider)
