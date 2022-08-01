export function stringifyValue (option) {
  try {
    const v = getOptionValue(option)
    return JSON.stringify(v)
  } catch (err) {
    console.error(err)
  }
}

export function getOptionValue (option) {
  return option?.value || option
}

export function getOptionLabel (option) {
  return option?.label || option
}

export function move (arr, oldIndex, newIndex) {
  const arrCopy = arr.slice()
  const element = arrCopy[oldIndex]
  arrCopy.splice(oldIndex, 1)
  arrCopy.splice(newIndex, 0, element)
  return arrCopy
}
