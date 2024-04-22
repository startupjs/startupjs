import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import Div from '../Div'
import Span from '../typography/Span'
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
  style,
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
    Div.root(
      style=style
      vAlign='center'
      styleName=[variant]
      row
    )
      Div.information(row vAlign='center')
        if icon
          Icon.icon(
            icon=icon === true ? ICONS[variant] : icon
            size='l'
            styleName=[variant]
          )
        Div.content(styleName={ indent: icon !== false })
          if title
            Span(bold)= title
          if typeof children === 'string'
            Span= children
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
  icon: true,
  variant: 'info'
}

Alert.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['info', 'error', 'warning', 'success']),
  title: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
  renderActions: PropTypes.func,
  onClose: PropTypes.func
}

export default observer(themed('Alert', Alert))
