# Common

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@startupjs/auth: >= 0.33.0
react-native-webview: 10.10.2
```

## Init on server
Importing a strategy:
```js
import { Strategy as CommonStrategy } from '@startupjs/auth-common/server'
```

In startupjsServer, in the strategy of the initAuth function need to add CommonStrategy:
```js
initAuth(ee, {
  strategies: [
    new CommonStrategy({
      providerName: 'virgin',
      authorizationURL: 'http://virgin.example.com/oauth/authorize',
      tokenURL: 'http://virgin.example.com/oauth/token',
      profileURL: 'http://virgin.example.com/oauth/get-me',
      clientId: 'e710f1a6-e43f-4775-ab85-5ab496167bb4',
      clientSecret: '7e2031ac-f634-467b-8105-707ffb46e879'
    })
  ]
})
```
**providerName** - the name for which the strategy will be assigned, for example, in AzureAD Strategy - this is azuread, based on this name, a callback route is created

**authorizationURL** - a link to confirm your login. Usually, when you click on it, a dialog box is displayed, which notifies you what user data will be used on the site

**tokenURL** - link to get access token

**profileURL** - link to get user data, with access token

## Init in layout
```js
import { AuthButton as VirginAuthButton } from '@startupjs/auth-common'
```

```jsx
return pug`
  VirginAuthButton(
    label='Virgin'
    providerName='virgin'
    style={ backgroundColor: '#e1090d' }
    imageUrl=BASE_URL + '/img/virgin.png'
  )
`
```
**label** - text displayed in the button

**providerName** - the same as the server strategy

**style** - styles for the button

**imageUrl** - link to the image, next to the label

You can also use this button for the microfrontend in initAuthApp:
```js
const auth = initAuthApp({
  socialButtons: [
    <GoogleAuthButton />,
    <LinkedinAuthButton />,
    <VirginAuthButton
      label='Virgin',
      providerName='virgin',
      style={{ backgroundColor: '#e1090d' }},
      imageUrl={BASE_URL + '/img/virgin.png'}
    />
  ]
})
```
