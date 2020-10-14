import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../typography/Span'
import Row from '../Row'
import Icon from '../Icon'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

function Alert ({
  variant,
  icon,
  label,
  onClose
}) {
  return pug`
    Row.root(
      vAlign='center'
      styleName=[variant]
    )
      if icon
        Div.iconWrapper
          Icon.icon(
            icon=icon
            styleName=[variant]
          )
      if label
        Span.label(
          styleName=[variant]
          numberOfLines=1
        )
          = label
      if onClose
        Div.closeIconWrapper(onPress=onClose)
          Icon.closeIcon(
            icon=faTimes
            styleName=[variant]
          )
  `
}

Alert.defaultProps = {
  variant: 'info'
}

Alert.propTypes = {
  variant: propTypes.oneOf(['info', 'error', 'warning', 'success']),
  label: propTypes.string,
  icon: propTypes.object,
  onClose: propTypes.func
}

export default observer(Alert)
