import React, { useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Row from '../../Row'
import Span from '../../typography/Span'
import Div from '../../Div'
import Icon from './../../Icon'
import MultiselectComponent from './multiselect'
import DefaultTag from './defaultTag'
import themed from '../../../theming/themed'
import './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  disabled,
  readonly,
  tagLimit,
  TagComponent,
  InputComponent,
  hasWidthCaption,
  renderListItem,
  onChange,
  onSelect,
  onRemove,
  onFocus,
  onBlur
}, ref) => {
  const [focused, setFocused] = useState(false)
  // Map array if user pass options pass an array of primitives
  // Convert it into { label, value } items for consistency
  const _options = options.map(opt => typeof opt === 'object' && opt !== null ? opt : { label: opt, value: opt })

  function _onRemove (_value) {
    onRemove && onRemove(_value)
    onChange && onChange(value.filter(v => v !== _value))
  }

  function _onSelect (_value) {
    onSelect && onSelect(_value)
    onChange && onChange([...value, _value])
  }

  function focusHandler () {
    setFocused(true)
    onFocus && onFocus()
  }

  function blurHandler () {
    setFocused(false)
    onBlur && onBlur()
  }

  const onItemPress = value => checked => {
    if (!checked) {
      _onRemove(value)
    } else {
      _onSelect(value)
    }
  }

  function _renderListItem (item) {
    const selected = value.includes(item.value)

    if (renderListItem) {
      return renderListItem(item, selected, onItemPress)
    }

    const onPress = onItemPress(item.value)

    return pug`
      Row.suggestionItem(
        vAlign='center'
        onPress=() => onPress(!selected)
      )
        Span.label= item.label
        Div.check
          if selected
            Icon(icon=faCheck styleName='checkIcon')
    `
  }

  return pug`
    MultiselectComponent(
      ref=ref
      options=_options
      value=value
      placeholder=placeholder
      focused=focused
      disabled=disabled
      tagLimit=tagLimit
      readonly=readonly
      InputComponent=InputComponent
      TagComponent=TagComponent
      hasWidthCaption=hasWidthCaption
      renderListItem=_renderListItem
      onOpen=focusHandler
      onHide=blurHandler
    )
  `
}

Multiselect.defaultProps = {
  value: [],
  options: [],
  placeholder: 'Select',
  disabled: false,
  readonly: false,
  hasWidthCaption: false,
  TagComponent: DefaultTag
}

Multiselect.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  tagLimit: PropTypes.number,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  hasWidthCaption: PropTypes.bool,
  renderListItem: PropTypes.func,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(
  themed('Multiselect', Multiselect),
  { forwardRef: true }
)
