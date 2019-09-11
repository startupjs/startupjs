# StartupJS

> React Native + Web full-stack framework

## Install:

### Step 1: Initialize new React Native project

Change *appname* to the name of your app in lowercase and without dashes or underscores.

```bash
npx react-native init appname
cd appname
```

If you want to use the RC version of RN, use the following command instead:

```bash
npx react-native@next init appname --version next
```

This will create a new React Native project in the *appname* folder.

### Step 2: Install *startupjs* building blocks

```bash
yarn add dm-bundler@alpha dm-sharedb-server@alpha react-sharedb@experimental
```

### Step 3: Configure Babel (for all targets)

Change `babel.config.js` to:

```js
const config = require('dm-bundler/babel.config')

// Override default babel config here.

// Default plugins are used for all targets - native, web and server:
// - config.plugins

// There are also the following target-specific envs with their own presets and plugins:
// - config.env.development         // native client dev
// - config.env.production          // native client prod
// - config.env.web_development     // web client dev
// - config.env.web_production      // web client prod
// - config.env.server              // server dev/prod

module.exports = config
```

### Step 4: Configure Metro builder

Change `metro.config.js` to:

```js
const config = require('dm-bundler/metro.config')

// Override default metro config here.

module.exports = config
```

### Step 5: Configure Web

1. Add `webpack.web.config.js` with:

```js
const getConfig = require('dm-bundler/webpack.web.config')

module.exports = getConfig(undefined, {
  forceCompileModules: [],
  alias: {}
})
```

2. Add `index.web.js` with:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const ROOT_CONTAINER_ID = 'app'

ReactDOM.render(<App />, document.getElementById(ROOT_CONTAINER_ID))  
```

3. Install `react-dom` to be able to render app in browser

```bash
yarn add react-dom
```

### Step 6: Configure Server (Node.js)

1. Add `webpack.server.config.js` with:

```js
const getConfig = require('dm-bundler/webpack.server.config')

module.exports = getConfig(undefined, {
  forceCompileModules: [],
  alias: {}
})
```

2. Add `.env` for default (development) client-side public env vars:

```
BASE_URL=http://127.0.0.1:3000
```

3. Add `.env.production` with overrides for release-build client env vars:

```
BASE_URL=https://example.com
```

4. Add `server.js` with:

```js
import 'react-sharedb/init'
import shareDbServer from 'dm-sharedb-server'

// Check 'dm-sharedb-server' readme for the full shareDbServer API
shareDbServer({ getHead }, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', (req, res) => res.json({ text: 'Test API' }))
  })
})

const getHead = appName => `
  <title>StartupJs</title>
  <!-- Put vendor JS and CSS here -->
`
```
