import React from 'react'
import { pug, observer } from 'startupjs'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import Icon from './../../Icon'
import themed from '../../../theming/themed'
import './index.styl'

// We can create this component using react-native-svg in future
// for partial filling (icon + linear gradient) or using star-half
// icon for 0.5 step

function Star ({
  style,
  active
}) {
  return pug`
    Icon.icon(
      styleName={active}
      style=style
      icon=faStar
    )
  `
}

export default observer(themed('Rating', Star))
