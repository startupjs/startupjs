# Authorization via Google

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@react-native-google-signin/google-signin: >= 6.0.0
@startupjs/auth: >= 0.33.0
```

## Creating an app
1 - Create an account [Firebase](https://console.firebase.google.com/), if not already created.
2 - Next, in the **Authentication** tab, enable authorization via **Google**.
3 - Copy from **Configuring the SDK for the web client** to config.json:
**Client ID** - as `GOOGLE_CLIENT_ID`
**Client secret** - as `GOOGLE_CLIENT_SECRET`
4 - Then hover over **?** after the text **Configuring the SDK for the web client**, click on **Google API Console**
5 - Go to **Web client (auto created by Google Service)**, in **URI** change `localhost:5000` to `localhost:3000`
6 - Add to **Разрешенные URI перенаправления** -
`http://localhost:3000/auth/google/callback`

## Init on server
Importing strategy:
```js
import { Strategy as GoogleStrategy } from '@startupjs/auth-google/server'
```

Importing lib for config:
```js
import conf from 'nconf'
```

In startupjsServer, in the strategy of the initAuth function need to add GoogleStrategy:
```js
initAuth(ee, {
    strategies: [
        new GoogleStrategy({
            clientId: conf.get('GOOGLE_CLIENT_ID'),
            clientSecret: conf.get('GOOGLE_CLIENT_SECRET'),
        })
    ]
})
```

## Use on mobile apps
**BASE_URL** should EVERYWHERE (.env, config.json) be - `http://localhost:3000`

## Android
1 - In **Firebase** on the project home page, add an Android app
2 - Valid package name in - `android/app/src/main/java/com/auth/MainActivity.java`, the first line
3 - Download **google-services.json**, drop it in a folder - `android/app`
4 - You need to generate the keys (call from the main folder):

keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android

5 - Next, go to the Firebase project settings, click on the gear - **"Project Settings"**
6 - There is an add button for the android app **"Add checksum"**, click on it, the field for entering the generated keys will open, enter SHA1 and SHA256

## iOS
1 - In **Firebase** on the project home page, add an iOS app
2 - Valid package ID - can be viewed via xCode (example: `org.reactjs.native.example.auth`)
3 - Download **GoogleService-Info.plist**
4 - Upload it to the project **via xCode** in the folder where AppDelegate is located
5 - In xCode, go to **Info**, find **URL Types**
In **URL Types** add `REVERSED_CLIENT_ID` from **Google Service-Info.plist**
6 - Update dependencies `cd ios && pod install`

## Init in layout
You can use component
```js
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google/client'
```

Or helper
```js
import { onLogin } from '@startupjs/auth-google/client'
```
```pug
Div.custom(onPress=onLogin)
```
