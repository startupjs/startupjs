import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
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
  variant: PropTypes.oneOf(['info', 'error', 'warning', 'success']),
  label: PropTypes.string,
  icon: PropTypes.object,
  onClose: PropTypes.func
}

export default observer(Alert)
