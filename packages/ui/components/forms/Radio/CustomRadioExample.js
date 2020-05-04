import React from 'react'
import Checkbox from '../Checkbox'

const CustomRadio = ({ value, onPress, label, checked }) => {
  return <Checkbox
    variant='switch'
    onChange={onPress}
    value={checked}
    label={label}
  />
}

export default CustomRadio
