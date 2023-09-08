import { useLayoutEffect } from 'react'
import { batch } from 'startupjs'
// TODO: Move CssVariables to basic startupjs and also move the singleton variables file to some generic lib
//       so that it's not tightly coupled with our custom stylesheets implementation
import singletonVariables from '@startupjs/babel-plugin-rn-stylename-to-style/variables'
// TODO: Figure out if we would want to transition default UI colors to be dynamic
// import defaultUiVariables from './defaultUiVariables'

export default function CssVariables ({ variables = {}, clear = true, children }) {
  // TODO: Figure out if we would want to transition default UI colors to be dynamic
  // variables = { ...defaultUiVariables, ...variables }
  useLayoutEffect(() => {
    batch(() => {
      // set new variables
      for (const variableName in variables) {
        if (variables[variableName] !== singletonVariables[variableName]) {
          singletonVariables[variableName] = variables[variableName]
        }
      }
      // remove old variables
      for (const variableName in singletonVariables) {
        if (variables[variableName] == null) {
          delete singletonVariables[variableName]
        }
      }
    })
    // clear dynamic theme when destroyed
    if (clear) {
      return () => {
        for (const variableName in singletonVariables) {
          delete singletonVariables[variableName]
        }
      }
    }
  }, [JSON.stringify(variables)])
  return children || null
}
