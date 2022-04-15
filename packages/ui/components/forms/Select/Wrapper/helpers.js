import isPlainObject from 'lodash/isPlainObject'

// TODO: create logic for objects with circular structure like jsx components

// Stringify values to omit bugs in Android/iOS Picker implementation

// Force undefined to be a special value to
// workaround the undefined value bug in Picker
export const PICKER_NULL = '-\u00A0\u00A0\u00A0\u00A0\u00A0'
export const NULL_OPTION = undefined

export function stringifyValue (option) {
  try {
    let value
    if (isPlainObject(option)) {
      value = option.value
    } else {
      value = option
    }
    return JSON.stringify(value)
  } catch (error) {
    console.warn('[@startupjs/ui] Select: ' + error)
  }
}

export function parseValue (value) {
  try {
    if (value === PICKER_NULL || value == null) {
      return undefined
    } else {
      return JSON.parse(value)
    }
  } catch (error) {
    console.warn('[@startupjs/ui] Select: ' + error)
  }
}

export function getLabel (option) {
  return '' + option?.label || option
}

export function getLabelFromValue (value, options) {
  for (const option of options) {
    if (stringifyValue(value) === stringifyValue(option)) {
      return getLabel(option)
    }
  }
  return getLabel(PICKER_NULL)
}
