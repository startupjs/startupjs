export default function prefixVars (prefix, vars) {
  if (!prefix) {
    throw new Error(
      '[@startupjs/mail] prefixVars: ' +
      'prefix parameter is required!'
    )
  }

  if (typeof vars !== 'object') {
    throw new Error(
      '[@startupjs/mail] prefixVars: ' +
      'vars parameter must be an object!'
    )
  }

  let result = {}

  for (let key in vars) {
    result[prefix + key] = vars[key]
  }

  return result
}
