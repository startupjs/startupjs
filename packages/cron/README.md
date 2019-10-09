# startupjs cron

## Usage

In project root create file. Do any initializations
here (plug in hooks, ORM, etc.) and then run your cron tasks.

```js
import '@startupjs/server/nconf'
import init from '@startupjs/init'
import orm from './../model/'
import hooks from './../server/hooks'
import getBackend from '@startupjs/backend'
import cron from 'node-cron'
const { backend } = getBackend({ hooks })
init({ orm })

cron.schedule('* * * * * *', async () => {
  const model = backend.createModel()
  // do some logic
  model.close()
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
