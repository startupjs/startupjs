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
IOS_CRITICAL_VERSION=1
ANDROID_CRITICAL_VERSION=1
WEB_CRITICAL_VERSION=1
ANDROID_UPDATE_LINK="market://details?id=company.example.app"
IOS_UPDATE_LINK="itms://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=0000000000&mt=8"
SUPPORT_EMAIL="admin@example.com"
```

### client

```js
// Root/App.js

import App from 'startupjs/app'
import * as main from '../main'
import * as admin from '../admin'
import { 
  IOS_CRITICAL_VERSION,
  ANDROID_CRITICAL_VERSION,
  WEB_CRITICAL_VERSION,
  ANDROID_UPDATE_LINK,
  IOS_UPDATE_LINK,
  SUPPORT_EMAIL
} from '@env'

return (
  <App
    apps={{ main, admin }}
    criticalVersion={ 
      ios: IOS_CRITICAL_VERSION,
      android: ANDROID_CRITICAL_VERSION,
      web: WEB_CRITICAL_VERSION
    }
    supportEmail=SUPPORT_EMAIL
    androidUpdateLink=ANDROID_UPDATE_LINK
    iosUpdateLink=IOS_UPDATE_LINK
    useGlobalInit={() => { 
      // A function that is called once each time the application is started
    }}
    goToHandler={(url, options, goTo) => { 
      // Callback that will be processed every time before going to url. You must pass the third argument `goTo`
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
  "CRITICAL_VERSION": {
    "ios": 1,
    "android": 1,
    "web": 1
  }
}

```

```js
// server/index.js

import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import CRITICAL_VERSION from '../criticalVersion.json'

startupjsServer({
  // ...
},
(ee, options) => {
  ee.on('backend', async backend => {
    initApp(backend, CRITICAL_VERSION)
  })
  ee.on('routes', expressApp => {
    expressApp.get('/api/serverSession', function (req, res) {
      return res.json(req.model.get('_session'))
    })
  })
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
