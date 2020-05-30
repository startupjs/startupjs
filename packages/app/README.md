# startupjs app
> Router component for multi apps

## Installation

```sh
yarn add @startupjs/app
```

## Installation

### Critical Version

Create `criticalVersion.json` in the root of your project. This file will hold the critical version info of your application.

If the version, specified on the server, stops matching the one in the client-side `<App />`, the user will be required to download an update from the app store.

```json
{
  "ios": 1,
  "android": 1,
  "web": 1,
  "meta": {
    "supportEmail": "admin@example.com",
    "iosUpdateLink": "itms://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=0000000000&mt=8",
    "androidUpdateLink": "market://details?id=company.example.app"
  }
}
```

### client

```js
// Root/App.js

import App from 'startupjs/app'
import * as main from '../main'
import * as admin from '../admin'
import CRITICAL_VERSION from '../criticalVersion.json'

return (
  <App
    apps={{ main, admin }}
    criticalVersion=CRITICAL_VERSION
  />
)
```

### server

```js
// server/index.js

import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import CRITICAL_VERSION from '../criticalVersion.json'

startupjsServer({
  // ...
},
(ee, options) => {
  initApp(ee, { criticalVersion: CRITICAL_VERSION })
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
