import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import config from './config'
import Span from '../Span'
import './index.styl'

function Progress ({
  value,
  total,
  label,
  color,
  disableLabel,
  textColor,
  ...props
}) {
  let currentProgress = 100 / total * value

  return pug`
    View
      View.progress
        View.filler(style={width: value <= total ? currentProgress + '%' : '100%', backgroundColor: color})
        if label && !disableLabel
          Span(description variant='caption')= value < total ? label + ' - ' + currentProgress.toFixed() + '% ...' : 'Loading Complete!'
  `
}

Progress.defaultProps = {
  value: 0,
  total: 100,
  label: 'Loading',
  color: config.fillerBg
}

Progress.PropTypes = {
  value: PropTypes.number,
  total: PropTypes.number,
  label: PropTypes.string,
  textColor: PropTypes.string,
  disableLabel: PropTypes.bool
}

export default observer(Progress)
