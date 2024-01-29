import { createElement as el } from 'react'
import { createPlugin } from 'startupjs/registry'
import UiProvider from './UiProvider.js'

export default createPlugin({
  name: 'ui',
  client: (props) => ({
    // TODO
    renderRoot ({ children }) {
      return el(UiProvider, props, children)
    }
  })
})
