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
  ...props
}) {
  return pug`
    View
      View.progress
        View.filler(style={width: value + '%'})
      if label && !disableLabel
        Span(description variant='caption')
          = label
          = ' - '
          = value <= 100 ? value + '% ...' : 'Complete'
  `
}

Progress.defaultProps = {
  value: 0,
  label: 'Loading'
}

Progress.PropTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  disableLabel: PropTypes.bool
}

export default observer(Progress)
