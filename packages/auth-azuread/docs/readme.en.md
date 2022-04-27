# Azure AD

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@startupjs/auth: >= 0.33.0
react-native-webview: 11.15.0
```

## Setting up app
1 - Go to [Microsoft Azure portal](https://portal.azure.com/)
2 - Create an account if you don't have one
3 - Go to **Active Directory**
4 - Go to the tab [App registration](https://portal.azure.com/?l=en.en-us#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
5 - Then **New registration**, fill in the fields
6 - Copy **Client ID** as `AZUREAD_CLIENT_ID` in config.json
7 - Copy **Tentant ID** as `AZUREAD_TENTANT_ID` in config.json
8 - Go to the tab **Endpoints**, copy **Identity metadata** as `AZUREAD_IDENTITY_METADATA` in config.json. Instead of **common/organizations** must stand **Tentant ID**.
9 - In the tab **Certificates and secrets**, create client secret, copy as `AZUREAD_CLIENT_SECRET` in config.json.
10 - Next, you need to configure URI redirects, to do this, go to the tab with the redirect URI settings. Create platforms with links:
SPA platform - `http://localhost:3000/auth/azuread/callback`
Web platform - `http://localhost:3000/auth/azuread/callback-native`
11 - In the manifest, specify the data:
  "oauth2AllowIdTokenImplicitFlow": true,
  "oauth2AllowImplicitFlow": true

## Init on server
Importing a strategy:
```js
import { Strategy as AzureadStrategy } from '@startupjs/auth-azuread/server'
```

Importing lib for the config:
```js
import conf from 'nconf'
```

In startupjsServer, in the strategy of the initAuth function need to add AzureadStrategy, with variables from the config:
```js
initAuth(ee, {
  strategies: [
    new AzureADStrategy({
      clientId: conf.get('AZUREAD_CLIENT_ID'),
      clientSecret: conf.get('AZUREAD_CLIENT_SECRET'),
      tentantId: conf.get('AZUREAD_TENTANT_ID'),
      identityMetadata: conf.get('AZUREAD_IDENTITY_METADATA'),
      allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production'
    })
  ]
})
```
Parameter `allowHttpForRedirectUrl` - determines whether it can be used `http` for `redirect url`
For production, you need to use https in BASE_URL, and the condition `process.env.NODE_ENV !== 'production'`

## Init in layout
```js
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread/client'
```
