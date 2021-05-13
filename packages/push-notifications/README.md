# Push Notifications

!IMPORTANT! The package only works on ios and android platforms!

## Dependencies

```js
@react-native-community/push-notification-ios >= 1.8.0
react-native-push-notification >= 7.2.3
```

## Installation

```sh
yarn add @startupjs/push-notifications @react-native-community/push-notification-ios react-native-push-notification
```


## Connecting certificates

### Create p8 certificate

In order to send push notifications to ios devices, you need to create certificates.

Select `Certificates, Identifiers & Profiles` and go to `Keys`. Click the + circle button to create a new key.

Give it a name and enable the `Apple Push Notifications service (APNs)`. Choose `Continue` and on the next screen choose `Register`.

It is important to record the following three elements from this page:

- Select `Download` to save the `p8` file locally. You will need to upload this to `Firebase`. You will not be able to download this certificate by leaving this page.
- Copy and save the `Key ID`.
- Copy and save your membership ID. It is located next to your name in the upper right corner of the Membership Center or in the `Membership Details` section.

### Setting up a Firebase project

You need to connect the `p8` certificate to your application in `Firebase`. In your `Firebase` project, select the gear next to `Project Overview` and select `Project settings`:

Then set up your iOS app in the `General` section of your project settings. Do all the operations indicated:

Then upload your `p8` certificate by going to `Cloud Messaging` in the `Firebase` project settings. In the `APNs Authentication Key` section, select `Upload`.

Enter the details that you saved in the step of creating the `p8` certificate.

## Using

### Connection

### server

```js
import { initFirebaseApp, initPushNotifications } from '@startupjs/push-notifications/server'
const serviceAccountPath = path.join(process.cwd(), 'path/to/serviceAccountKey.json')
...
init({ orm })
initFirebaseApp(serviceAccountPath)

...
startupjsServer({
...
}, (ee, options) => {
  ...
  initPushNotifications(ee)
  ...
}

```
You can generate a `serviceAccount` in the `Firebase` [console](https://console.firebase.google.com/project/) of your application. Open the `Service accounts` tab and click `Generate new private key`.

### client

Call `initPushNotifications` (if you need to create an additional channel for the android, then add the `initAndroidChannel` function) in the place where you need to initialize the device token of the current user (devices are written based on the userId from the current session). It makes sense to perform initialization only for an authorized user. But, if necessary, initialization is allowed for each visitor, for this functions can be called directly in the `useGlobalInit` callback of `App`.

```js
App(
  ...
  useGlobalInit=() => {
    initPushNotifications()
    // Creation of an additional channel, the 'default' channel is created when initPushNotifications are executed
    initAndroidChannel({
        channelId: 'my-test-channel',
        channelName: 'My channel'
    })
    return true
  }
)
```

## API

### server API

- `initPushNotifications (ee)`

- `initFirebaseApp(serviceAccount)` - initialization of the `Firebase` application. How to create a `serviceAccount` see [above](/docs/libraries/push-notofications#server).
  - `serviceAccountPath` - string, absolute path to `serviceAccount`.

### client API

- `initAndroidChannel (options, callback)` - function of registering a new channel of push messages for Android. Push notifications on `Android` must be sent to the channel, otherwise the message will not be delivered. Several different channels can be created.
  - `options` - object of options for creating a channel, a complete list of options can be found in the [documentation](https://github.com/zo0r/react-native-push-notification#channel-management-android). Required parameters:
    - `channelId` - string, channel unique identifier
    - `channelName` - string, channel name
  - `callback` - callback, takes an argument `created`, which indicates whether the channel has already been created, `false` means that the channel has already been created

- `initPushNotifications (options)` - function of initializing push notifications. Also initializes the channel id `default` for android.
  - `options` - object of options for initializing push notifications. A complete list of options can be found in the [documentation](https://github.com/zo0r/react-native-push-notification#usage). !!IMPORTANT!! It is highly discouraged to override the `onRegister` and `onNotification` fields as this may break the package behavior.

- `sendNotification(userIds, title, body, androidChannelId, filters = {})` - function for sending notifications. Options:
  - `userIds` - array of user id to which the push notification will be sent.
  - `title` - string of title
  - `body` - string of content.
  - `androidChannelId` - string with the channel name for android.
  - `filters` - object of filters. The following fields are supported:
    - `platforms` - array of platforms to send notification to. If not specified, the message will be sent to all registered devices.

