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
    useProps: (props) => {
      return props
    }
  },
  checkbox: {
    Component: WrappedCheckbox,
    useProps: ({ disabled, value, readonly, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        configuration: { isLabelClickable: !disabled && !readonly },
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
      disabled,
      onChangeColor,
      ...props
    }, ref) => {
      ;({ value, onChangeColor } = useBind({ value, $value, onChangeColor }))

      return {
        value,
        configuration: { isLabelClickable: !disabled },
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
      disabled,
      readonly,
      onChangeDate,
      ...props
    }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'date',
        date: value,
        configuration: { isLabelClickable: !disabled && !readonly },
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
      disabled,
      readonly,
      onChangeDate,
      ...props
    }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'datetime',
        date: value,
        configuration: { isLabelClickable: !disabled && !readonly },
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
      disabled,
      readonly,
      onChangeDate,
      ...props
    }, ref) => {
      ;({ value, onChangeDate } = useBind({ value, $value, onChangeDate }))

      return {
        mode: 'time',
        date: value,
        configuration: { isLabelClickable: !disabled && !readonly },
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
      disabled,
      readonly,
      onChange,
      ...props
    }, ref) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        configuration: { isLabelClickable: !disabled && !readonly },
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
      disabled,
      readonly,
      onChangeNumber,
      ...props
    }, ref) => {
      ;({ value, onChangeNumber } = useBind({ value, $value, onChangeNumber }))

      return {
        value,
        configuration: { isLabelClickable: !disabled && !readonly },
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
      disabled,
      readonly,
      onChangeText,
      ...props
    }, ref) => {
      ;({ value, onChangeText } = useBind({ value, $value, onChangeText }))

      return {
        value,
        configuration: { isLabelClickable: !disabled && !readonly },
        onChangeText,
        _onLabelPress: () => ref.current && ref.current.focus(),
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
  select: {
    Component: WrappedSelect,
    useProps: ({ value, $value, onChange, ...props }) => {
      ;({ value, onChange } = useBind({ value, $value, onChange }))

      return {
        value,
        onChange,
        ...props
      }
    }
  },
  text: {
    Component: WrappedTextInput,
    useProps: ({
      value,
      $value,
      readonly,
      disabled,
      onChangeText,
      ...props
    }, ref) => {
      ;({ value, onChangeText } = useBind({ value, $value, onChangeText }))

      return {
        value,
        configuration: { isLabelClickable: !disabled && !readonly },
        onChangeText,
        _onLabelPress: () => ref.current && ref.current.focus(),
        ...props
      }
    }
  }
}

export default inputs
