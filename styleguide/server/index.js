import init from 'startupjs/init'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ]
}, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', async (req, res) => {
      let { model } = req
      let $counter = model.at('counters.first')
      await $counter.subscribeAsync()
      res.json({ name: 'Test API', counter: $counter.get() })
    })
  })
})

function getHead (appName) {
  return `
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
  `
}
