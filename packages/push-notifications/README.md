# Notifications
> Push notifications component

## Required dependencies

  `react-native-onesignal>=4.0.5`

## Installation

```sh
  yarn add @startupjs/push-notifications react-native-onesignal
```

### iOS

  Follow [step 4](https://documentation.onesignal.com/docs/react-native-sdk-setup#step-4---install-for-ios-using-cocoapods-for-ios-apps) to set up notifications on iOS.

  Step `4.3.6` can be skipped.

### Android

  To configure Android you need to get and register in `OneSignal` [Firebase Server Key](https://documentation.onesignal.com/docs/generate-a-google-server-api-key). Follow the steps according to the manual.

  Don't forget to add the `google-service.json` file as specified in `Firebase` when configuring your application.

### Linking

Run the command in the root directory of your project:

```sh
npx startupjs link -o
```

!Important! you need to run it from the root directory.

## Connect to startupjs

### server

In `server/index.js` add the following lines:
```js
  import { initNotifications, getOneSignalHead } from '@startupjs/push-notifications/server'
```

In `startupjsServer` add:
```js
  startupjsServer({
    // Some your options
  }, (ee, options) => {
    //... Some your code
    initNotifications(ee)
  }
```

In `getHead` add `getOneSignalHead`:

```js
function getHead (appName) {
  return `
    ${getUiHead()}
    ${getOneSignalHead()}
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
    </script>
  `
}
```

### client

In `Root/index.js` add `initOneSignal`:

```js
// Your imports
import { initOneSignal } from '@startupjs/push-notifications'

//...
init({ baseUrl: BASE_URL, orm })

initOneSignal()

//...
})
```

## General settings

In the file `config.json` add the fields:

```js
{
  ...
  "ONESIGNAL_REST_KEY": "YOUR_REST_KEY",
  "ONESIGNAL_APP_ID": "YOUR_APP_ID"
}
```

These keys can be found in your app settings on the [onesignal website](https://app.onesignal.com/apps). For this:
- Select your application from the list
- Select `Settings` from the top menu
- Select `Keys & IDs`
- In the `ONESIGNAL_REST_KEY` copy the value from the `REST API KEY` field
- In `ONESIGNAL_APP_ID`, copy the value from the field `ONESIGNAL APP ID`

## API

### client

- `initOneSignal(useInit)` - `useInit` - the function that will be called after registering the application, here you can place functions from the(https://documentation.onesignal.com/docs/react-native-sdk).

- `OneSignal` - the `onesignal` instance that allows you to use the [React Native SDK](https://documentation.onesignal.com/docs/react-native-sdk) and the [Web Push SDK](https://documentation.onesignal.com/docs/web-push-sdk). Use only this instance within the application!

- `sendNotification(data)` - function to send notifications, use the request structure as specified in [SERVER REST API](https://documentation.onesignal.com/reference/create-notification). !IMPORTANT! the `app_id` field is not required.

## Using custom ids to register users with onesignal

The first time the application is launched, a unique `id` in `onesignal` will be generated for the user (you can see them in the `Audience` section [of your application in onesignal](https://app.onesignal.com/apps/)). This behavior is inconvenient, since usually users already have local `id`. 

To write an additional `id` for a user, you can use the `setExternalUserId(local_id)` method.

```js
const LOCAL_ID = 'localId'
OneSignal.setExternalUserId(LOCAL_ID)
```

Within `startupjs`, for example:

```js
//...
import { OneSignal } from '@startupjs/push-notifications'

// ...
const [userId] = useSession('userId')
OneSignal.setExternalUserId(userId)
//...
```

## Testing

You can test the operation of notifications for iOS only on a real device. An important point is that the device on which the testing will be performed and the computer must be on the same network at the time of launch. It is also necessary in `env` and in `config.json` to replace the address `http://localhost:3000` with the real ip address of your computer at the moment.

Once configured, run the build of the application in `xcode` for the connected device.

### Test function for `initOneSignal`

Use this function to familiarize yourself with event handlers in [React Native SDK](https://documentation.onesignal.com/docs/react-native-sdk).

```js
import { OneSignal } from '@startupjs/push-notifications'

export default async function defaultUseInit () {
  OneSignal.setLogLevel(6, 0)
  OneSignal.setRequiresUserPrivacyConsent(false)
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response)
  })

  /* O N E S I G N A L  H A N D L E R S */
  OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
    console.log('OneSignal: notification will show in foreground:', notifReceivedEvent)
  })

  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification)
  })

  OneSignal.setInAppMessageClickHandler(event => {
    console.log('OneSignal IAM clicked:', event)
  })

  OneSignal.addEmailSubscriptionObserver((event) => {
    console.log('OneSignal: email subscription changed: ', event)
  })

  OneSignal.addSubscriptionObserver(event => {
    console.log('OneSignal: subscription changed:', event)
  })

  OneSignal.addPermissionObserver(event => {
    console.log('OneSignal: permission changed:', event)
  })

  const deviceState = await OneSignal.getDeviceState()
  console.log('deviceState: ', deviceState)
}
```