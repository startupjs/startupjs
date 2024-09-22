# 2fa-manager

Component for using various two-factor authentication methods.

## Installation

```sh
  yarn add @startupjs/2fa-manager
```

## Connecting to startupjs

### server

Add the following lines to `server/index.js`:

```js
  import { initTwoFAManager } from '@startupjs/2fa-manager/server'
```

Add function to `startupjsServer`:

```js
  initTwoFAManager(ee, {
    providers: [YOUR_PROVIDER1, YOUR_PROVIDER2]
  })
```

### Creating custom providers

You can create your own providers using the `Provider` class from `@startupjs/2fa-manager/Provider`.

Class `Provider(name, send, check)` where:

- `name` - string, provider name.
- `send()` - function of sending a message with a code.
- `check(code)` - function for checking the validity of the code.
  - `code` - the code to check.

## Example

```js
import { Provider } from '@startupjs/2fa-manager/Provider'

function init (ee, options) {
  return null
}

function send () {
  console.log('test code')
}

function check (token) {
  if (token === 'test code') {
    console.log('Right code')
  } else {
    console.log('Wrong code')
  }
}

export default new Provider('testProvider', init, send, check)
```

Now this `Provider` can be registered with `initTwoFaManager` and used by the name `testProvider`.

## API

### server

### `initTwoFaManager(ee, options)`

- `ee` - eventEmitter of server.
- `options` - options object. Contains a list of providers:
  - `providers` - array of providers.

### TwoFAManager

Singleton class that contains the following methods:

- `send(model, session, providerName)` - calls the `send` method of the provider `providerName`.
- `check(model, session, token, providerName)` - calls the `check` method of the provider `providerName`.
- `getProviders()` - returns an array of the names of the registered providers.

### client

### ProvidersList2fa(providers, chooseProvider)

Component for displaying a list of registered providers. Accepts the following props:

- `providers` - array of provider names
- `chooseProvider` - function, returns the name of the selected provider
