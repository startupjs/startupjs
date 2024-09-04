import { createElement as el } from 'react'
import { createPlugin, ROOT_MODULE as MODULE } from 'startupjs/registry'
import { setCustomInputs, setCustomIcons } from './globalCustomInputs'
import UiProvider from './UiProvider'

let executedFormHook = false

export default createPlugin({
  name: 'ui',
  enabled: true,
  order: 'system ui',
  client: (props) => ({
    renderRoot ({ children }) {
      if (!executedFormHook) {
        executedFormHook = true
        const mergePlugins = (hookName, errorMessage, setFunction) => {
          const data = MODULE.hook(hookName)
            .reduce((allItems, pluginItems = {}) => {
              for (const item in pluginItems) {
                if (allItems[item]) {
                  console.warn(errorMessage(item))
                }
              }
              return { ...allItems, ...pluginItems }
            }, {})
          setFunction(data)
        }
        mergePlugins('icons', ERRORS.iconAlreadyDefined, setCustomIcons)
        mergePlugins('customFormInputs', ERRORS.inputAlreadyDefined, setCustomInputs)
      }
      return el(UiProvider, props, children)
    }
  })
})

const ERRORS = {
  inputAlreadyDefined: input => `
    Custom input type "${input}" is already defined by another plugin. It will be overridden!
  `,
  iconAlreadyDefined: icon => `
    Custom icons "${icon}" is already defined by another plugin. It will be overridden!
  `
}
