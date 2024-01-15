import { createProject } from 'startupjs/registry'

export default createProject({
  allowUnusedPluginOptions: true,
  plugins: {
    dummy: {
      server: (() => {
        console.log('> on server')
        return () => ({})
      })(),
      client: (() => {
        console.log('> on client')
        return () => ({})
      })(),
      isomorphic: (() => {
        console.log('> on isomorphic')
        return () => ({})
      })(),
      build: (() => {
        console.log('> on build')
        return () => ({})
      })()
    }
  }
})
