# startupjs cron

## Installation

```sh
yarn add node-cron
```

## Usage

Create `cron.js` file in the root of your project. Perform all initialization
here (plug in hooks, ORM, etc.) and then run your cron tasks.

```js
// Initialize env vars
import 'startupjs/nconf'
import init from 'startupjs/init'
import orm from './../model/'
import hooks from './../server/hooks'
import getBackend from 'startupjs/backend'
import cron from 'node-cron'
const { backend } = getBackend({ hooks })
init({ orm })

cron.schedule('* * * * * *', async () => {
  const model = backend.createModel()
  // do some logic
  model.close()
})
```

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
