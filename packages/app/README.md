# startupjs app
> Router component for multi apps

## Installation

```sh
yarn add @startupjs/app
```

## Usage

### client

```js
import App from '@startupjs/app'
import * as main from '../main'
import * as admin from '../admin'

const SUPPORT_EMAIL = 'admin@example.com'
const IOS_UPDATE_LINK = 'itms://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=0000000000&mt=8'
const ANDROID_UPDATE_LINK = 'market://details?id=company.example.app'
// Object where key is Platform.OS and value is number
const CRITICAL_VERSION = {
  ios: Number,
  android: Number,
  web: Number
}

return (
  <App
    apps={{ main, admin }}
    supportEmail=SUPPORT_EMAIL
    criticalVersion=CRITICAL_VERSION
    iosUpdateLink=IOS_UPDATE_LINK
    androidUpdateLink=ANDROID_UPDATE_LINK
  />
)
```

### server
```js
import startupjsServer from '@startupjs/server'
import { initUpdateApp } from '@startupjs/app/server'

// Object where key is Platform.OS and value is number
// For example
const CRITICAL_VERSION = {
  ios: Number,
  android: Number,
  web: Number
}

startupjsServer({
  // ...
},
(ee, options) => {
  ee.on('backend', async backend => {
    initUpdateApp(backend, CRITICAL_VERSION)
  })
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
