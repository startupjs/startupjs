# startupjs app
> Router component for multi apps

## Installation

```sh
yarn add @startupjs/app
```

## Installation

### Critical Version

Add critical version info to your `.env` file in the root of your project.

If the version, specified on the server, stops matching the one in the client-side `<App />`, the user will be required to download an update from the app store.

```js
CRITICAL_VERSION_IOS=1
CRITICAL_VERSION_ANDROID=1
CRITICAL_VERSION_WEB=1
UPDATE_LINK_ANDROID="market://details?id=company.example.app"
UPDATE_LINK_IOS="itms://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=0000000000&mt=8"
SUPPORT_EMAIL="admin@example.com"
```

### client

```js
// Root/App.js

import App from 'startupjs/app'
import * as main from '../main'
import * as admin from '../admin'
import { 
  CRITICAL_VERSION_IOS,
  CRITICAL_VERSION_ANDROID,
  CRITICAL_VERSION_WEB,
  UPDATE_LINK_ANDROID,
  UPDATE_LINK_IOS,
  SUPPORT_EMAIL
} from '@env'

return (
  <App
    apps={{ main, admin }}
    criticalVersion={ 
      ios: CRITICAL_VERSION_IOS,
      android: CRITICAL_VERSION_ANDROID,
      web: CRITICAL_VERSION_WEB
    }
    supportEmail=SUPPORT_EMAIL
    androidUpdateLink=UPDATE_LINK_ANDROID
    iosUpdateLink=UPDATE_LINK_IOS
    useGlobalInit={() => { 
      // A function that is called once each time the application is started
    }}
    goToHandler={(url, options, goTo) => { 
      // Callback that will be processed every time before going to url. You must pass the third argument `goTo`. You need to be sure to call goTo in your goTo handler with the final url.
    }}
    errorPages={ 
      404: '<h1>404 NOT FOUND</h1>',
      ...,
    } // Takes an object in the format {
      //   error status number: "html code that should be displayed for this error",
      //   ...,
      // }
  />
)
```

### server
Add critical version info to your `config.json` file in the root of your project. This file will hold the critical version info of your application.

```json
{
  "CRITICAL_VERSION_IOS": 1,
  "CRITICAL_VERSION_ANDROID": 1,
  "CRITICAL_VERSION_WEB": 1,
}

```

```js
// server/index.js

import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import { 
  CRITICAL_VERSION_IOS,
  CRITICAL_VERSION_ANDROID,
  CRITICAL_VERSION_WEB
 } from '../config.json'

startupjsServer({
  // ...
},
(ee, options) => {
  initApp(ee, {
    ios: CRITICAL_VERSION_IOS,
    android: CRITICAL_VERSION_ANDROID,
    web: CRITICAL_VERSION_WEB
  })
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
