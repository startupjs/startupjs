# @startupjs/2fa-totp-authentication-provider

Provider for verification via google authenticator app.

## Dependencies

```js
@startupjs/2fa-manager >= 0.34.0,
@startupjs/2fa-totp-authentication >= 0.34.0
```

## Installation

```js
  yarn add @startupjs/2fa-totp-authentication-provider
```

**IMPORTANT**: To use this method, in advance, the user must provide a secret in the form of a QR code, which he will add to the google-authenticator. More on this in the [google-authenticator documentation](/docs/libraries/2fa/2fa-totp-authentication)

## Using

You need to import the `GAProvider` component from `@startupjs/2fa-totp-authentication-provider`.

```js
import { GAProvider } from '@startupjs/2fa-totp-authentication-provider'
```

Then you need to add `GAProvider` to the` providers` array of `initTwoFAManager`. The second argument of the array is the options for the provider. `TotpProvider` expects an application name, this name will be displayed in the `google authenticator` interface.

You can get the name of the application from `app.json`, usually this file is located in the root of the project:

```js
import app from 'path/to/your/app.json'

...

initTwoFAManager(ee, {
  providers: [
    [TotpProvider, { appName: app.expo.name }]
  ]
})
```
