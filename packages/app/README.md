# startupjs app
> Router component for multi apps

## Installation

```sh
yarn add @startupjs/app
```

## Requirements

```
react: *
react-native: *
react-native-restart: >= 0.0.22
startupjs: *
```

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
import { useHistory } from 'react-router-native'


  const CustomError = ({ error, supportEmail }) => {
    const history = useHistory()
    return(
      <Div>
        <Span>{error.code} Error</Span>
        <Span>{error.message}</Span>
        <Button onPress={() => history.goBack()}>Go back</Button>
      </Div>
    )
  }

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
      404: CustomError,
      ...,
    } // Takes an object in the format {
      //   error status number: Component that will be rendered
      //   ...,
      // }
  />
)
```

#### Display an error
You can change the error page to your own by passing an object of the following structure to the `errorPages` property:
- `ERROR_KEY (Component)`: specific page for `ERROR_KEY`
- `default (Component)`: the page that will be used when there is no specific page for the `ERROR_KEY`

Component will invoke with next props:
- `supportEmail`: supportEmail from <App>
- `error`: The entity of throwed error (object `{code, message}`)

To show an error page, use `emit('error', { ERROR_KEY, message })`, where `ERROR_KEY` is the unique identifier of the error.
To hide an error page when the error occurred, use `emit('error')` (it is equivalent to `emit('error', '')`).

```js
import App, { ErrorTemplate } from 'startupjs/app'
// ...some imports

const NewError= () => {
  return(
    <ErrorTemplate
      title={'405: My custom error'}
      description={'My custom description'}
    ></ErrorTemplate>
  )
}

return (
  <App
    //...some props
    errorPages={
      405: NewError
    }
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
import conf from 'nconf'

startupjsServer({
  // ...
},
(ee, options) => {
  initApp(ee, {
    ios: conf.get('CRITICAL_VERSION_IOS'),
    android: conf.get('CRITICAL_VERSION_ANDROID'),
    web: conf.get('CRITICAL_VERSION_WEB')
  })
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
