import React, { useState } from 'react'
import { observer, u } from 'startupjs'
import PropTypes from 'prop-types'
import MultiselectComponent from './multiselect'
import DefaultTag from './defaultTag'

import './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  disabled,
  popoverWidth,
  readonly,
  error,
  TagComponent,
  onChange,
  onSelect,
  onRemove
}) => {
  const [showOpts, setShowOpts] = useState(false)
  // Map array if user pass options pass an array of primitives
  // Convert it into { label, value } items for consistency
  const _options = options.map(opt => typeof opt === 'object' && opt !== null ? opt : { label: opt, value: opt })

  function removeOpt (_value) {
    onRemove && onRemove(_value)
    onChange && onChange(value.filter(v => v !== _value))
  }

  function selectOpt (_value) {
    onSelect && onSelect(_value)
    onChange && onChange([...value, _value])
  }

  function showOptsMenu () {
    setShowOpts(true)
  }

  function hideOptsMenu () {
    setShowOpts(false)
  }

  return pug`
    MultiselectComponent(
      options=_options
      value=value
      onSelect=selectOpt
      onRemove=removeOpt
      placeholder=placeholder
      label=label
      showOptsMenu=showOptsMenu
      hideOptsMenu=hideOptsMenu
      showOpts=showOpts
      disabled=disabled
      readonly=readonly
      popoverWidth=popoverWidth
      error=error
      TagComponent=TagComponent
    )
  `
}

Multiselect.propTypes = {
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  popoverWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func
}

Multiselect.defaultProps = {
  value: [],
  options: [],
  placeholder: 'Select',
  disabled: false,
  readonly: false,
  popoverWidth: u(30),
  TagComponent: DefaultTag
}

export default observer(Multiselect)
