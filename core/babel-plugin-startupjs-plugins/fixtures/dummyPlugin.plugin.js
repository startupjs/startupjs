import { createPlugin } from 'startupjs/registry'

export default createPlugin({
  name: 'dummyPlugin',
  server: ({ dummyPluginOption1 }) => ({
    api (expressApp) {
      console.log('dummy-plugin', dummyPluginOption1)
    }
  })
})
