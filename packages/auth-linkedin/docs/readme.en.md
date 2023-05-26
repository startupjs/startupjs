# Authorization via Linkedin

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@startupjs/auth: >= 0.33.0
react-native-webview: 10.10.2
```

## Setting up app
1 - Create a software application [link](https://www.linkedin.com/developers)
2 - In the **Auth** tab, copy **Client ID** as `LINKEDIN_CLIENT_ID`, **Client Secret** as `LINKEDIN_CLIENT_SECRET`
3 - Add links for redirects, on tab **Authorized redirect URLs for your app**:
`http://localhost:3000/auth/linkedin/callback`
`http://localhost:3000/auth/linkedin/callback-native`
4 - In **Products** tab, select **Sign In with LinkedIn**

## Init on server
Importing strategy:
```js
import { Strategy as AzureadStrategy } from '@startupjs/auth-azuread/server'
```

Importing lib for config:
```js
import conf from 'nconf'
````

In startupjsServer, in the strategy of the initAuth function need to add LinkedinStrategy:
```js
initAuth(ee, {
  strategies: [
    new LinkedinStrategy({
      clientId: conf.get('LINKEDIN_CLIENT_ID'),
      clientSecret: conf.get('LINKEDIN_CLIENT_SECRET')
    })
  ]
})
```

Dynamic initialization of the strategy is also available, which occurs every time directly at the moment of user authorization.

```js
initAuth(ee, {
  strategies: [
    new LinkedinStrategy({
      getClient: async function(req) {
        // ...
        return {
          id: '######',
          secret: '######'
        }
      },
    })
  ]
})
```

## Init in layout
```js
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
```
