# Authorization via Facebook

## Init main module
[Configuring main module](/docs/auth/main)

## Requirements
```
@startupjs/auth: >= 0.33.0
react-native-fbsdk: >= 1.0.0
```

## Creating an app
Create [here](https://developers.facebook.com/apps/) facebook app.
Copy **client ID** in config.json, as `FACEBOOK_CLIENT_ID`.
Next, in the settings, copy the **App Secret** to config.json, as `FACEBOOK_CLIENT_SECRET`.

## Init on server
Importing a strategy:
```js
import { Strategy as FacebookStrategy } from '@startupjs/auth-facebook/server'
```

Importing lib for config:
```js
import conf from 'nconf'
````

In startupjsServer, in the strategy of the initAuth function need to add FacebookStrategy:
```js
initAuth(ee, {
  strategies: [
    new FacebookStrategy({
      clientId: conf.get('FACEBOOK_CLIENT_ID'),
      clientSecret: conf.get('FACEBOOK_CLIENT_SECRET'),
    })
  ]
})
```

## Use on mobile apps
### Firebase
1 - Create an account [Firebase](https://console.firebase.google.com/), if not already created.
2 - Next, in the **Authentication** tab, enable authorization via **Facebook** by entering the required data.
3 - Copy the redirect URL, and paste in [app settings](https://developers.facebook.com/apps) (**Log in via Facebook** -> **Settings** -> **Valid redirect URIs for OAuth**).

### Android
In `android/app/src/main/res/values`, need to add (Where `FACEBOOK_CLIENT_ID` is the id of the current app):
```xml
<string name="facebook_app_id">FACEBOOK_CLIENT_ID</string>
```
In `android/app/src/main/AndroidManifest.xml`, in the application tag, you need to add:
```xml
<meta-data
    android:name="com.facebook.sdk.ApplicationId"
    android:value="@string/facebook_app_id" />
```

In [Facebook developers](https://developers.facebook.com/apps), in the settings, at the very bottom ** **Add platform**, choose **Android**, next click on the button **Get started quickly**.
Enter the data in the lower tab **Tell us about the project for Android**

Next, we generate and enter the necessary keys.

### iOS
Update the `pod install ' dependencies.

In **Info.plist**, at the very end, up to the last `</dict></plist>`, you need to add:
```
<key>CFBundleURLTypes</key>
<array>
    <dict>
    <key>CFBundleURLSchemes</key>
    <array>
        <string>fbFACEBOOK_CLIENT_ID</string>
    </array>
    </dict>
</array>
<key>FacebookAppID</key>
<string>FACEBOOK_CLIENT_ID</string>
<key>FacebookDisplayName</key>
<string>startupjs-auth</string>
```
FACEBOOK_CLIENT_ID - replace with the desired id.
FacebookDisplayName - on the right one.

## Init in layout
You can use the component
```js
import { AuthButton as FacebookAuthButton } from '@startupjs/auth-facebook/client'
```

Or a helper
```js
import { onLogin } from '@startupjs/auth-facebook/client'
```

```pug
Div.custom(onPress=onLogin)
```
