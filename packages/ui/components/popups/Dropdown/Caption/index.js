import React from 'react'
import propTypes from 'prop-types'
import Row from '../../../Row'
import Span from '../../../typography/Span'
import Icon from '../../../Icon'
import Button from '../../../Button'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'startupjs'
import './index.styl'

const DropdownCaption = ({
  children,
  placeholder,
  variant,
  _activeLabel
}) => {
  if (variant === 'custom') {
    return children
  }

  if (variant === 'button') {
    return pug`
      Button(variant='flat' color='primary')
        = placeholder
    `
  }

  return pug`
    Row.select
      Span.placeholder(styleName={ active: !!_activeLabel })
        = _activeLabel || placeholder
      Icon(icon=faAngleDown)
  `
}

DropdownCaption.defaultProps = {
  placeholder: 'Select a state...',
  variant: 'select'
}

DropdownCaption.propTypes = {
  placeholder: propTypes.string,
  variant: propTypes.oneOf(['select', 'button', 'custom'])
}

export default observer(DropdownCaption)
