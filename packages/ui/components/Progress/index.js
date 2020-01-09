import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import Div from '../Div'
import PropTypes from 'prop-types'
import { ui } from 'config'
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
  let currentProgress = (100 / total * value).toFixed()

  return pug`
    Div.root
      if title
        Text.title(
          style={ color: textColor || '' }
        )= title
      Div.progress(style={backgroundColor: unfilledColor})
        Div.line(style={width: value <= total ? currentProgress + '%' : '100%', backgroundColor: color})
        if label && !disableLabel
          Text.label= value < total ? label + ' - ' + currentProgress + '% ...' : 'Loading Complete!'
  `
}

Progress.defaultProps = {
  value: 1,
  total: 100,
  label: 'Loading',
  unfilledColor: ui.colors.darkLighter,
  color: ui.colors.primary
}

Progress.PropTypes = {
  value: PropTypes.number,
  total: PropTypes.number,
  label: PropTypes.string,
  title: PropTypes.string,
  textColor: PropTypes.string,
  unfilledColor: PropTypes.string,
  color: PropTypes.string,
  disableLabel: PropTypes.bool
}

export default observer(Progress)
