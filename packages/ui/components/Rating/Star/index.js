import React from 'react'
import { observer } from 'startupjs'
import Icon from './../../Icon'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

// We can create this component using react-native-svg in future
// for partial filling (icon + linear gradient) or using star-half
// icon for 0.5 step

export default observer(function Star ({
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
})
