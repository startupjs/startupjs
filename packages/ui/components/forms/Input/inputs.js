import React from 'react'
import { useBind } from 'startupjs'
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
    }
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
    isLabelColoredWhenFocusing: true
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
    isLabelColoredWhenFocusing: true
  }
)
const WrappedRadio = wrapInput(Radio)
const WrappedSelect = wrapInput(
  Select,
  {
    rows: {
      descriptionPosition: 'bottom'
    },
    isLabelColoredWhenFocusing: true
  }
)
const WrappedTextInput = wrapInput(
  TextInput,
  {
    rows: {
      descriptionPosition: 'bottom'
    },
    isLabelColoredWhenFocusing: true
  }
)

const inputs = {
  array: {
    Component: WrappedArrayInput,
    useProps: ({ $value }) => ({ $value })
  },
  checkbox: {
    Component: WrappedCheckbox,
    useProps: ({ disabled, value, readonly, $value, onChange }) => {
      const bindingProps = useBind({ value, $value, onChange })
      return {
        configuration: { isLabelClickable: !disabled && !readonly },
        ...bindingProps
      }
    }
  },
  color: {
    Component: WrappedColorPicker,
    useProps: ({ value, $value, onChangeColor }) => {
      const bindingProps = useBind({ value, $value, onChangeColor })
      return bindingProps
    }
  },
  date: {
    Component: WrappedDateTimePicker,
    useProps: ({ value, $value, onChangeDate }) => {
      const bindingProps = useBind({ value, $value, onChangeDate })
      return {
        mode: 'date',
        ...bindingProps
      }
    }
  },
  datetime: {
    Component: WrappedDateTimePicker,
    useProps: ({ value, $value, onChangeDate }) => {
      const bindingProps = useBind({ value, $value, onChangeDate })
      return {
        mode: 'datetime',
        ...bindingProps
      }
    }
  },
  time: {
    Component: WrappedDateTimePicker,
    useProps: ({ value, $value, onChangeDate }) => {
      const bindingProps = useBind({ value, $value, onChangeDate })
      return {
        mode: 'time',
        ...bindingProps
      }
    }
  },
  multiselect: {
    Component: WrappedMultiselect,
    useProps: ({ value, $value, disabled, readonly, onChange }) => {
      const bindingProps = useBind({ value, $value, onChange })
      return {
        configuration: { isLabelClickable: !disabled && !readonly },
        ...bindingProps
      }
    }
  },
  number: {
    Component: WrappedNumberInput,
    useProps: ({ value, $value, disabled, readonly, onChangeNumber }) => {
      const bindingProps = useBind({ value, $value, onChangeNumber })
      return {
        configuration: { isLabelClickable: !disabled && !readonly },
        ...bindingProps
      }
    }
  },
  object: {
    Component: WrappedObjectInput,
    useProps: ({ $value }) => ({ $value })
  },
  password: {
    Component: WrappedPasswordInput,
    useProps: ({ value, $value, disabled, readonly, onChangeText }) => {
      const bindingProps = useBind({ value, $value, onChangeText })
      return {
        configuration: { isLabelClickable: !disabled && !readonly },
        ...bindingProps
      }
    }
  },
  radio: {
    Component: WrappedRadio,
    useProps: ({ value, $value, onChange }) => ({ value, $value, onChange })
  },
  select: {
    Component: WrappedSelect,
    useProps: ({ value, $value, onChange }) => ({ value, $value, onChange })
  },
  text: {
    Component: WrappedTextInput,
    useProps: ({ value, $value, readonly, disabled, onChangeText }) => {
      const bindingProps = useBind({ value, $value, onChangeText })
      return {
        configuration: { isLabelClickable: !disabled && !readonly },
        ...bindingProps
      }
    }
  }
}

export default inputs
