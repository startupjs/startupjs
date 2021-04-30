# Apple Authorization

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@invertase/react-native-apple-authentication: >= 2.1.0
@startupjs/auth: >= 0.33.0
```

## Setting up app
1 - Open project in xCode
2 - Targets -> Signing & Capabilities
3 - Add team
4 - Add Capability - Sign in with Apple
5 - Go to [Identifiers](https://developer.apple.com/account/resources/identifiers/list/). The ID should appear there
6 - Go to [Keys](https://developer.apple.com/account/resources/authkeys/list)
7 - Create a new key. Choose **Sign in with Apple**. In the tab **Edit** - select the desired one **Primary App ID**
8 - After registration, save **Key ID** and download the p8 certificate
9 - **Key ID** to throw in config as `APPLE_KEY_ID`
10 - Go to [Services IDs](https://developer.apple.com/account/resources/identifiers/list/serviceId)
11 - Register a Service ID, with any ID
12 - Throw this ID in **config.json** as `APPLE_CLIENT_ID`
13 - We go into it, put a check mark **Sign In with Apple**
14 - Opening **Configure**
15 - We put the desired one **Primary App ID**
16 - Filling domain and callback urls. Apple does not accept localhost, you can use ngrok for tests, for example:
https://c48c1b8bb802.ngrok.io/auth/apple/callback,
https://c48c1b8bb802.ngrok.io/auth/apple/callback-native

## Init on server
Importing a strategy:
```js
import { Strategy as AppleStrategy } from '@startupjs/auth-apple/server'
```

Importing a lib for the config:
```js
import conf from 'nconf'
```

In **startupjsServer**, in the strategy of the initAuth function, you need to add **AppleStrategy**, with variables from the config:
```js
initAuth(ee, {
  strategies: [
    new AppleStrategy({
      clientId: conf.get('APPLE_CLIENT_ID'),
      teamId: conf.get('APPLE_TEAM_ID'),
      keyId: conf.get('APPLE_KEY_ID'),
      privateKeyLocation: path.join(process.cwd(), 'путь к файлу p8')
    })
  ]
})
```

For tests, you can use **testBaseUrl**

## Init in layout
```js
import { AuthButton as AppleAuthButton } from '@startupjs/auth-apple/client'
```
