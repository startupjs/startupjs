import 'startupjs/init'
import startupjsServer from 'startupjs/server'

// Check '@startupjs/server' readme for the full API
startupjsServer({ getHead }, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', (req, res) => res.json({ text: 'Test API' }))
  })
})

const getHead = appName => `
  <title>HelloWorld</title>
  <!-- Put vendor JS and CSS here -->
`
