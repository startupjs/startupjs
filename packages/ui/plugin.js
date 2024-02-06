import { createElement as el } from 'react'
import { createPlugin } from 'startupjs/registry'
import UiProvider from './UiProvider'

export default createPlugin({
  name: 'ui',
  enabled: true,
  order: 'system ui',
  client: (props) => ({
    renderRoot ({ children }) {
      return el(UiProvider, props, children)
    }
  })
})
