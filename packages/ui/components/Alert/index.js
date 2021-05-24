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
import themed from '../../theming/themed'
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
  renderActions,
  children,
  onClose
}) {
  if (label) {
    children = label
    console.warn('[@startupjs/ui] Alert: label is DEPRECATED, use children instead.')
  }

  return pug`
    Row.root(styleName=[variant])
      if icon !== false
        Icon.icon(
          icon=icon || ICONS[variant]
          size='l'
          styleName=[variant]
        )
      Div.content(styleName={ indent: icon !== false })
        if title
          Span(bold)
            = title
        if typeof children === 'string'
          Span
            = children
        else
          = children
      if renderActions
        Div.actions
          = renderActions()
      else if onClose
        Div.actions(onPress=onClose)
          Icon.icon(
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
  children: PropTypes.node,
  variant: PropTypes.oneOf(['info', 'error', 'warning', 'success']),
  title: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool, PropTypes.func]),
  renderActions: PropTypes.func,
  onClose: PropTypes.func
}

export default observer(themed(Alert))
