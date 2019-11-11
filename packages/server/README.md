# dm-sharedb-server
> Express.js server with ShareDB, configs system, and react-router support for rendering client apps.

## Usage

```javascript
import startupjsServer from '@startupjs/server'

startupjsServer({ getHead }, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', async (req, res) => {
      let { model } = req
      let $counter = model.at('counters.first')
      await $counter.subscribeAsync()
      res.json({ name: 'Test API', counter: $counter.get() })
    })
  })
})

const getHead = appName => `
  <title>HelloWorld</title>
  <!-- Put vendor JS and CSS here -->
`
```

## MIT Licence

Copyright (c) 2016 Pavel Zhukov
