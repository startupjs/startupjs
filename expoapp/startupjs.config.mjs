export default {
  isomorphic: {
    allowUnusedPlugins: true,
    server: true
  },
  server: {
    init: options => ({
      api: expressApp => {
        expressApp.get('/hello', (req, res) => {
          res.send('Hello from server')
        })
      }
    })
  },
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
}
