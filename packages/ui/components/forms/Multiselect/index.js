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
  maxTagCount,
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
  const shouldDisableSelection = maxTagCount
    ? maxTagCount === value.length
    : false

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

  function _renderListItem ({ item, index }) {
    const { label, value: itemValue } = item
    const selected = value.includes(itemValue)
    const onPress = onItemPress(itemValue)

    return pug`
      Div(
        key=itemValue
        vAlign='center'
        disabled=selected ? false : shouldDisableSelection
        onPress=() => onPress(!selected)
      )
        if renderListItem
          = renderListItem({ item, index, selected })
        else
          Row.suggestionItem
            Span.label= label
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
      maxTagCount=maxTagCount
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
  tagLimitVariant: 'hidden',
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
  tagLimitVariant: PropTypes.oneOf(['hidden', 'disabled']),
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
