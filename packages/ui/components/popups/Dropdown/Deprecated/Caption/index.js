import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Row from '../../../../Row'
import Span from '../../../../typography/Span'
import Icon from '../../../../Icon'
import Button from '../../../../Button'
import themed from '../../../../../theming/themed'
import './index.styl'

function DropdownCaption ({
  children,
  placeholder,
  variant,
  _activeLabel
}) {
  if (variant === 'custom') {
    return children
  }

  if (variant === 'button') {
    return pug`
      Button(
        variant='flat'
        color='primary'
        pointerEvents='box-none'
      )= placeholder
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

export default observer(themed('DropdownCaption', DropdownCaption))
