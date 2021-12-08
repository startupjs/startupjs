import React from 'react'
import wrapInput from './wrapInput'
import ArrayInput from '../ArrayInput'
import Checkbox from '../Checkbox'
import DateTimePicker from '../DateTimePicker'
import Multiselect from '../Multiselect'
import NumberInput from '../NumberInput'
import ObjectInput from '../ObjectInput'
import PasswordInput from '../PasswordInput'
import Radio from '../Radio'
import Select from '../Select'
import TextInput from '../TextInput'
import ColorPicker from '../ColorPicker'
import Card from './../../Card'

function cardWrapper (style, children) {
  return pug`
    Card(
      style=style
      variant='outlined'
    )
      = children
  `
}

const WrappedArrayInput = wrapInput(
  ArrayInput,
  {
    rows: { _renderWrapper: cardWrapper },
    columns: { _renderWrapper: cardWrapper }
  }
)
const WrappedCheckbox = wrapInput(
  Checkbox,
  {
    rows: {
      labelPosition: 'right',
      descriptionPosition: 'bottom'
    },
    isLabelClickable: true
  }
)
const WrappedColorPicker = wrapInput(
  ColorPicker,
  {
    rows: {
      descriptionPosition: 'bottom'
    }
  }
)
const WrappedDateTimePicker = wrapInput(
  DateTimePicker,
  { rows: { descriptionPosition: 'bottom' } }
)
const WrappedMultiselect = wrapInput(Multiselect)
const WrappedNumberInput = wrapInput(
  NumberInput,
  {
    rows: {
      descriptionPosition: 'bottom'
    },
    isLabelColoredWhenFocusing: true,
    isLabelClickable: true
  }
)
const WrappedObjectInput = wrapInput(
  ObjectInput,
  {
    rows: { _renderWrapper: cardWrapper },
    columns: { _renderWrapper: cardWrapper }
  }
)

const WrappedPasswordInput = wrapInput(
  PasswordInput,
  {
    rows: {
      descriptionPosition: 'bottom'
    },
    isLabelColoredWhenFocusing: true,
    isLabelClickable: true
  }
)
const WrappedRadio = wrapInput(Radio)
const WrappedSelect = wrapInput(
  Select,
  {
    rows: {
      descriptionPosition: 'bottom'
    },
    isLabelColoredWhenFocusing: true,
    isLabelClickable: true
  }
)
const WrappedTextInput = wrapInput(
  TextInput,
  {
    rows: {
      descriptionPosition: 'bottom'
    },
    isLabelColoredWhenFocusing: true,
    isLabelClickable: true
  }
)

const inputs = {
  array: {
    Component: WrappedArrayInput,
    getProps: ({ $value }) => ({ $value })
  },
  checkbox: {
    Component: WrappedCheckbox,
    getProps: ({ disabled, value, $value, onChange }) => ({
      disabled,
      configuration: { isLabelClickable: !disabled },
      value,
      $value,
      onChange
    })
  },
  color: {
    Component: WrappedColorPicker,
    getProps: ({ value, $value, onChangeColor }) => ({
      value,
      $value,
      onChangeColor
    })
  },
  date: {
    Component: WrappedDateTimePicker,
    getProps: ({ value, $value, onChangeDate }) => ({
      mode: 'date',
      date: value,
      $value: $value,
      onChangeDate
    })
  },
  datetime: {
    Component: WrappedDateTimePicker,
    getProps: ({ value, $value, onChangeDate }) => ({
      mode: 'datetime',
      date: value,
      $value: $value,
      onChangeDate
    })
  },
  time: {
    Component: WrappedDateTimePicker,
    getProps: ({ value, $value, onChangeDate }) => ({
      mode: 'time',
      date: value,
      $value: $value,
      onChangeDate
    })
  },
  multiselect: {
    Component: WrappedMultiselect,
    getProps: ({ value, $value, onChange }) => ({ value, $value, onChange })
  },
  number: {
    Component: WrappedNumberInput,
    getProps: ({ value, $value, onChangeNumber }) => ({
      value, $value, onChangeNumber
    })
  },
  object: {
    Component: WrappedObjectInput,
    getProps: ({ $value }) => ({ $value })
  },
  password: {
    Component: WrappedPasswordInput,
    getProps: ({ value, $value, onChangeText }) => ({
      value,
      $value,
      onChangeText
    })
  },
  radio: {
    Component: WrappedRadio,
    getProps: ({ value, $value, onChange }) => ({ value, $value, onChange })
  },
  select: {
    Component: WrappedSelect,
    getProps: ({ value, $value, onChange }) => ({ value, $value, onChange })
  },
  text: {
    Component: WrappedTextInput,
    getProps: ({ value, $value, readonly, onChangeText }) => ({
      value,
      $value,
      configuration: { isLabelClickable: !readonly },
      // TODO: Use stringInsert and stringRemove
      onChangeText
    })
  }
}

export default inputs
