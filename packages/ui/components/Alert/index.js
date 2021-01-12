import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import {
  faExclamationCircle,
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import Div from '../Div'
import Span from '../typography/Span'
import Row from '../Row'
import Icon from '../Icon'
import './index.styl'

const ICONS = {
  info: faInfoCircle,
  error: faExclamationCircle,
  warning: faExclamationTriangle,
  success: faCheckCircle
}
function Alert ({
  variant,
  icon,
  label,
  title,
  ActionComponent,
  onClose
}) {
  return pug`
    Row.root(
      vAlign='start'
      styleName=[variant]
    )
      if icon !== false
        Div.iconWrapper
          Icon.icon(
            icon=icon || ICONS[variant]
            size='l'
            styleName=[variant]
          )
      Div.content
        if title
          Span.title(
            bold
            numberOfLines=1
          )
            = title
        if label
          Span.label(
            numberOfLines=1
          )
            = label
      if ActionComponent
        ActionComponent
      if !ActionComponent && onClose
        Div.closeIconWrapper(onPress=onClose)
          Icon.closeIcon(
            icon=faTimes
            size='l'
            styleName=[variant]
          )
  `
}

Alert.defaultProps = {
  variant: 'info'
}

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'error', 'warning', 'success']),
  title: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  ActionComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onClose: PropTypes.func
}

export default observer(Alert)
