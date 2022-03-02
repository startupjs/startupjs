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
  { rows: { descriptionPosition: 'bottom' } }
)
const WrappedDateTimePicker = wrapInput(
  DateTimePicker,
  { rows: { descriptionPosition: 'bottom' } }
)
const WrappedMultiselect = wrapInput(Multiselect)
const WrappedNumberInput = wrapInput(
  NumberInput,
  { rows: { descriptionPosition: 'bottom' } }
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
  { rows: { descriptionPosition: 'bottom' } }
)
const WrappedRadio = wrapInput(Radio)
const WrappedSelect = wrapInput(
  Select,
  { rows: { descriptionPosition: 'bottom' } }
)
const WrappedTextInput = wrapInput(
  TextInput,
  { rows: { descriptionPosition: 'bottom' } }
)

const inputs = {
  array: {
    Component: WrappedArrayInput,
    useProps: ({ $value }) => useBind({ $value })
  },
  checkbox: {
    Component: WrappedCheckbox,
    useProps: ({ disabled, value, readonly, $value, onChange }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        configuration: { isLabelClickable: !disabled && !readonly },
        _onLabelPress: () => { onChange(!value) },
        onChange
      }
    }
  },
  color: {
    Component: WrappedColorPicker,
    useProps: ({ value, $value, disabled, onChangeColor }, ref) => {
      const bindingProps = useBind({ value, $value, onChangeColor })
      return {
        configuration: { isLabelClickable: !disabled },
        _onLabelPress: () => { ref.current && ref.current.show() },
        ...bindingProps
      }
    }
  },
  date: {
    Component: WrappedDateTimePicker,
    useProps: ({ value, $value, disabled, readonly, onChangeDate }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'date',
        date: value,
        configuration: {
          isLabelClickable: !disabled && !readonly,
          isLabelColoredWhenFocusing: !readonly
        },
        _onLabelPress: () => ref.current && ref.current.focus(),
        onChangeDate
      }
    }
  },
  datetime: {
    Component: WrappedDateTimePicker,
    useProps: ({ value, $value, disabled, readonly, onChangeDate }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'datetime',
        date: value,
        configuration: { isLabelClickable: !disabled && !readonly },
        _onLabelPress: () => ref.current && ref.current.focus(),
        onChangeDate
      }
    }
  },
  time: {
    Component: WrappedDateTimePicker,
    useProps: ({ value, $value, disabled, readonly, onChangeDate }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'time',
        date: value,
        configuration: { isLabelClickable: !disabled && !readonly },
        _onLabelPress: () => ref.current && ref.current.focus(),
        onChangeDate
      }
    }
  },
  multiselect: {
    Component: WrappedMultiselect,
    useProps: ({ value, $value, disabled, readonly, onChange }, ref) => {
      const bindingProps = useBind({ value, $value, onChange })
      return {
        configuration: {
          isLabelClickable: !disabled && !readonly,
          isLabelColoredWhenFocusing: !readonly
        },
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...bindingProps
      }
    }
  },
  number: {
    Component: WrappedNumberInput,
    useProps: ({ value, $value, disabled, readonly, onChangeNumber }, ref) => {
      const bindingProps = useBind({ value, $value, onChangeNumber })
      return {
        configuration: {
          isLabelClickable: !disabled && !readonly,
          isLabelColoredWhenFocusing: !readonly
        },
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...bindingProps
      }
    }
  },
  object: {
    Component: WrappedObjectInput,
    useProps: ({ $value }) => useBind({ $value })
  },
  password: {
    Component: WrappedPasswordInput,
    useProps: ({ value, $value, disabled, readonly, onChangeText }, ref) => {
      const bindingProps = useBind({ value, $value, onChangeText })
      return {
        configuration: {
          isLabelClickable: !disabled && !readonly,
          isLabelColoredWhenFocusing: !readonly
        },
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...bindingProps
      }
    }
  },
  radio: {
    Component: WrappedRadio,
    useProps: ({ value, $value, onChange }) => useBind({ value, $value, onChange })
  },
  select: {
    Component: WrappedSelect,
    useProps: ({ value, $value, readonly, onChange }) => {
      const bindingProps = useBind({ value, $value, onChange })
      return {
        configuration: {
          isLabelColoredWhenFocusing: !readonly
        },
        ...bindingProps
      }
    }
  },
  text: {
    Component: WrappedTextInput,
    useProps: ({ value, $value, readonly, disabled, onChangeText }, ref) => {
      const bindingProps = useBind({ value, $value, onChangeText })
      return {
        configuration: {
          isLabelClickable: !disabled && !readonly,
          isLabelColoredWhenFocusing: !readonly
        },
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...bindingProps
      }
    }
  }
}

export default inputs
