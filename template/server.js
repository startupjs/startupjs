import 'startupjs/init'
import shareDbServer from 'dm-sharedb-server'

// Check 'dm-sharedb-server' readme for the full shareDbServer API
shareDbServer({ getHead }, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', (req, res) => res.json({ text: 'Test API' }))
  })
})

const getHead = appName => `
  <title>HelloWorld</title>
  <!-- Put vendor JS and CSS here -->
`
