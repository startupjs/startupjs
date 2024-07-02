import { createElement as el } from 'react'
import { createPlugin, ROOT_MODULE as MODULE } from 'startupjs/registry'
import { setCustomInputs } from './globalCustomInputs'
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
        const hooks = MODULE.hook('customFormInputs')
        const customInputs = hooks
          .reduce((allInputs, pluginInputs = {}) => {
            for (const input in pluginInputs) {
              if (allInputs[input]) console.warn(ERRORS.inputAlreadyDefined(input))
            }
            return { ...allInputs, ...pluginInputs }
          }, {})
        setCustomInputs(customInputs)
      }
      return el(UiProvider, props, children)
    }
  })
})

const ERRORS = {
  inputAlreadyDefined: input => `
    Custom input type "${input}" is already defined by another plugin. It will be overridden!
  `
}
