import { useCallback } from 'react'
import { variables as singletonVariables } from 'startupjs'

const VARS_REGEX = /"var\(\s*(--[A-Za-z0-9_-]+)\s*,?\s*(.*?)\s*\)"/g

export default function useTransformCssVariables (styles) {
  return useCallback(transformCssVariable, [])
}

function transformCssVariable (styles) {
  let strStyles = JSON.stringify(styles)
  strStyles = strStyles.replace(VARS_REGEX, (match, varName, varDefault) => {
    let res
    if (singletonVariables[varName] != null) {
      res = singletonVariables[varName]
    } else {
      res = varDefault
    }
    if (typeof res === 'string') {
      res = res.trim()
      // replace 'px' value with a pure number
      res = res.replace(/px$/, '')
      // sometimes compiler returns wrapped brackets. Remove them
      const bracketsCount = res.match(/^\(+/)?.[0]?.length || 0
      res = res.substring(bracketsCount, res.length - bracketsCount)
    }
    if (!isNumeric(res)) {
      res = `"${res}"`
    }
    return res
  })
  return JSON.parse(strStyles)
}

function isNumeric (num) {
  return (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && !isNaN(num)
}
