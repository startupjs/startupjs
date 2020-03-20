import React from 'react'
import { observer } from 'startupjs'
import Icon from './../../Icon'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import config from '../../../config/rootConfig'
import './index.styl'

// We can create this component using react-native-svg in future
// for partial filling (icon + linear gradient) or using star-half
// icon for 0.5 step

export default observer(function Star ({
  style,
  active
}) {
  const color = active ? config.colors.warning : config.colors.darkLighter

  return pug`
    Icon(
      style=style
      icon=faStar
      color=color
    )
  `
})
