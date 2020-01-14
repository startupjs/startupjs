import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import Span from '../Span'
import './index.styl'

function Progress ({
  value,
  label,
  disableLabel,
  variant,
  ...props
}) {
  return pug`
    View
      View.progress
        View.filler(style={width: value + '%'})
      unless variant === 'compact'
        Span(description variant='caption')
          = label || (value < 100 && value + '% ...' || 'Loading Complete')
  `
}

Progress.defaultProps = {
  value: 0
}

Progress.PropTypes = {
  value: PropTypes.number,
  label: PropTypes.string
}

export default observer(Progress)
