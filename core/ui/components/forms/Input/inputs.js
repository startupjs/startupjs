import React from 'react'
import { pug, useBind } from 'startupjs'
import wrapInput, { isWrapped } from './wrapInput'
import ArrayInput from '../ArrayInput'
import Card from './../../Card'
import Checkbox from '../Checkbox'
import ColorPicker from '../ColorPicker'
import DateTimePicker from '../DateTimePicker'
import Multiselect from '../Multiselect'
import NumberInput from '../NumberInput'
import ObjectInput from '../ObjectInput'
import PasswordInput from '../PasswordInput'
import Rank from '../Rank'
import Radio from '../Radio'
import RangeInput from '../RangeInput'
import Select from '../Select'
import TextInput from '../TextInput'
import FileInput from '../FileInput'
import useCustomInputs from '../Form/useCustomInputs'
import { customInputs } from './globalCustomInputs'

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
  {
    rows: { descriptionPosition: 'bottom' },
    isLabelColoredWhenFocusing: true
  }
)
const WrappedMultiselect = wrapInput(
  Multiselect,
  {
    isLabelColoredWhenFocusing: true
  }
)
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
const WrappedFileInput = wrapInput(FileInput)
const WrappedRank = wrapInput(Rank)
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
const WrappedRange = wrapInput(RangeInput)

const inputs = {
  array: {
    Component: WrappedArrayInput,
    useProps: (props) => {
      return props
    }
  },
  checkbox: {
    Component: WrappedCheckbox,
    useProps: ({ value, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChange,
        _onLabelPress: () => { onChange(!value) },
        ...props
      }
    }
  },
  color: {
    Component: WrappedColorPicker,
    useProps: ({
      value,
      $value,
      onChangeColor,
      ...props
    }, ref) => {
      ;({ value, onChangeColor } = useBind({ value, $value, onChangeColor }))

      return {
        value,
        configuration: { isLabelClickable: !props.disabled },
        onChangeColor,
        _onLabelPress: () => { ref.current && ref.current.show() },
        ...props
      }
    }
  },
  date: {
    Component: WrappedDateTimePicker,
    useProps: ({
      value,
      $value,
      onChangeDate,
      ...props
    }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'date',
        date: value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChangeDate,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  },
  datetime: {
    Component: WrappedDateTimePicker,
    useProps: ({
      value,
      $value,
      onChangeDate,
      ...props
    }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'datetime',
        date: value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChangeDate,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  },
  time: {
    Component: WrappedDateTimePicker,
    useProps: ({
      value,
      $value,
      onChangeDate,
      ...props
    }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'time',
        date: value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChangeDate,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  },
  multiselect: {
    Component: WrappedMultiselect,
    useProps: ({
      value,
      $value,
      onChange,
      ...props
    }, ref) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChange,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  },
  number: {
    Component: WrappedNumberInput,
    useProps: ({
      value,
      $value,
      onChangeNumber,
      ...props
    }, ref) => {
      ;({ value, onChangeNumber } = useBind({ value, $value, onChangeNumber }))

      return {
        value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChangeNumber,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  },
  object: {
    Component: WrappedObjectInput,
    useProps: (props) => {
      return props
    }
  },
  password: {
    Component: WrappedPasswordInput,
    useProps: ({
      value,
      $value,
      onChangeText,
      ...props
    }, ref) => {
      ;({ value, onChangeText } = useBind({ value, $value, onChangeText }))

      return {
        value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChangeText,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  },
  file: {
    Component: WrappedFileInput,
    useProps: ({ value, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))
      return {
        value,
        onChange,
        ...props
      }
    }
  },
  rank: {
    Component: WrappedRank,
    useProps: ({ value, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        onChange,
        ...props
      }
    }
  },
  radio: {
    Component: WrappedRadio,
    useProps: ({ value, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        onChange,
        ...props
      }
    }
  },
  range: {
    Component: WrappedRange,
    useProps: ({ value, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        onChange,
        ...props
      }
    }
  },
  select: {
    Component: WrappedSelect,
    useProps: ({ value, $value, enum: _enum, options, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))
      // if json-schema `enum` is passed, use it as options
      if (!options && _enum) options = _enum
      return {
        value,
        onChange,
        options,
        ...props
      }
    }
  },
  text: {
    Component: WrappedTextInput,
    useProps: ({
      value,
      $value,
      onChangeText,
      ...props
    }, ref) => {
      ;({ value, onChangeText } = useBind({ value, $value, onChangeText }))
      return {
        value,
        configuration: { isLabelClickable: !props.disabled && !props.readonly },
        onChangeText,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  }
}

export const customFormInputs = customInputs

export default inputs

export const ALL_INPUTS = Object.keys(inputs)

export function useInputMeta (input) {
  const customInputsFromContext = useCustomInputs()
  const componentMeta = customInputsFromContext[input] || customFormInputs[input] || inputs[input]
  if (!componentMeta) throw Error(ERRORS.inputNotFound(input))
  let Component, useProps
  if (componentMeta.Component) {
    ;({ Component, useProps } = componentMeta)
  } else {
    Component = componentMeta
  }
  if (!isWrapped(Component)) {
    if (!autoWrappedInputs.has(Component)) {
      autoWrappedInputs.set(Component, wrapInput(Component))
    }
    Component = autoWrappedInputs.get(Component)
  }
  useProps ??= props => props
  return { Component, useProps }
}

const autoWrappedInputs = new WeakMap()

const ERRORS = {
  inputAlreadyDefined: input => `
    Custom input type "${input}" is already defined by another plugin. It will be overridden!
  `,
  inputNotFound: input => `
    Implementation for a custom input type "${input}" was not found!
  `
}
