import React from 'react'
import { observer } from 'startupjs'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import config from './config'
import './index.styl'

function Progress ({
  value,
  total,
  label,
  color,
  unfilledColor,
  disableLabel,
  title,
  textColor,
  ...props
}) {
  let currentProgress = 100 / total * value

  return pug`
    View
      if title
        Text.title(
          style={ color: textColor || '' }
        )= title
      View.progress(style={backgroundColor: unfilledColor})
        View.filler(style={width: value <= total ? currentProgress + '%' : '100%', backgroundColor: color})
        if label && !disableLabel
          Text.label= value < total ? label + ' - ' + currentProgress.toFixed() + '% ...' : 'Loading Complete!'
  `
}

Progress.defaultProps = {
  value: 0,
  total: 100,
  label: 'Loading',
  unfilledColor: config.bgColor,
  color: config.fillerBg
}

Progress.PropTypes = {
  value: PropTypes.number,
  total: PropTypes.number,
  label: PropTypes.string,
  title: PropTypes.string,
  textColor: PropTypes.string,
  disableLabel: PropTypes.bool
}

export default observer(Progress)
