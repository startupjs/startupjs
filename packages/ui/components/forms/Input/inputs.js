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

const WrappedArrayInput = wrapInput(ArrayInput)
const WrappedCheckbox = wrapInput(
  Checkbox,
  {
    layoutOptions: {
      rows: {
        labelPosition: 'right',
        descriptionPosition: 'bottom'
      }
    },
    _isLabelClickable: true
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
    layoutOptions: {
      rows: {
        descriptionPosition: 'bottom'
      }
    },
    _isLabelColoredWhenFocusing: true,
    _isLabelClickable: true
  }
)
const WrappedObjectInput = wrapInput(ObjectInput)
const WrappedPasswordInput = wrapInput(
  PasswordInput,
  {
    layoutOptions: {
      rows: {
        descriptionPosition: 'bottom'
      }
    },
    _isLabelColoredWhenFocusing: true,
    _isLabelClickable: true
  }
)
const WrappedRadio = wrapInput(Radio)
const WrappedSelect = wrapInput(
  Select,
  {
    layoutOptions: {
      rows: {
        descriptionPosition: 'bottom'
      }
    },
    _isLabelColoredWhenFocusing: true,
    _isLabelClickable: true
  }
)
const WrappedTextInput = wrapInput(
  TextInput,
  {
    layoutOptions: {
      rows: {
        descriptionPosition: 'bottom'
      }
    },
    _isLabelColoredWhenFocusing: true,
    _isLabelClickable: true
  }
)

const inputs = {
  array: {
    Component: WrappedArrayInput,
    getProps: ({ $value }) => ({ $value })
  },
  checkbox: {
    Component: WrappedCheckbox,
    getProps: ({ value, $value, onChange }) => ({ value, $value, onChange })
  },
  date: {
    Component: WrappedDateTimePicker,
    getProps: ({ value, $value, onDateChange }) => ({
      date: value,
      $date: $value,
      mode: 'date',
      onDateChange
    })
  },
  datetime: {
    Component: WrappedDateTimePicker,
    getProps: ({ value, $value, onDateChange }) => ({
      date: value,
      $date: $value,
      mode: 'datetime',
      onDateChange
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
  time: {
    Component: WrappedDateTimePicker,
    getProps: ({ value, $value, onDateChange }) => ({
      date: value,
      $date: $value,
      mode: 'time',
      onDateChange
    })
  },
  text: {
    Component: WrappedTextInput,
    getProps: ({ value, $value, onChangeText }) => ({
      value,
      $value,
      // TODO: Use stringInsert and stringRemove
      onChangeText
    })
  }
}

export default inputs
