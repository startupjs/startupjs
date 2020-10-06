import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MultiselectComponent from './multiselect'
import { observer, u } from 'startupjs'

import './index.styl'

const Multiselect = ({
  options,
  value,
  onSelect,
  onRemove,
  onChange,
  placeholder,
  label,
  tagVariant,
  activeColor,
  disabled,
  popoverWidth
}) => {
  const [showOpts, setShowOpts] = useState(false)

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
      options=options
      value=value
      onSelect=selectOpt
      onRemove=removeOpt
      placeholder=placeholder
      label=label
      showOptsMenu=showOptsMenu
      hideOptsMenu=hideOptsMenu
      showOpts=showOpts
      tagVariant=tagVariant
      activeColor=activeColor
      disabled=disabled
      popoverWidth=popoverWidth
    )
  `
}

Multiselect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  tagVariant: PropTypes.string,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool,
  popoverWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

Multiselect.defaultProps = {
  value: [],
  options: [],
  placeholder: 'Select',
  tagVariant: 'flat',
  activeColor: 'primary',
  disabled: false,
  popoverWidth: u(30)
}

export default observer(Multiselect)
