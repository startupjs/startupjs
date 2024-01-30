import { createElement as el } from 'react'
import { createPlugin } from 'startupjs/registry'
import UiProvider from './UiProvider'

export default createPlugin({
  name: 'ui',
  client: (props) => ({
    renderRoot ({ children }) {
      return el(UiProvider, props, children)
    }
  })
})
