// TODO: create logic for objects with circular structure like jsx components

// Stringify values to omit bugs in Android/iOS Picker implementation

// Force undefined to be a special value to
// workaround the undefined value bug in Picker
export const PICKER_NULL = '-\u00A0\u00A0\u00A0\u00A0\u00A0'
export const NULL_OPTION = undefined

export function stringifyValue (option) {
  try {
    let value
    if (option && option.value != null) {
      value = option.value
    } else {
      value = option
    }
    if (value == null) return PICKER_NULL
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
  let label
  if (option && option.label != null) {
    label = option.label
  } else {
    label = option
  }
  if (label == null) return PICKER_NULL
  return '' + label
}

export function getLabelFromValue (value, options, emptyValueLabel = NULL_OPTION) {
  for (const option of options) {
    if (stringifyValue(value) === stringifyValue(option)) {
      return getLabel(option)
    }
  }
  return getLabel(emptyValueLabel)
}
