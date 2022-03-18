# Push Notifications

!IMPORTANT! The package only works on ios and android platforms!

## Dependencies

```js
@react-native-community/push-notification-ios >= 1.8.0
react-native-push-notification >= 7.2.3
```

## Installation

```js
yarn add @startupjs/push-notifications @react-native-community/push-notification-ios react-native-push-notification
```

## Connecting certificates

### Create p8 certificate

In order to send push notifications to ios devices, you need to create certificates.

Login to your [Apple Developer account](https://developer.apple.com/account).

Select `Certificates, Identifiers & Profiles` and go to `Keys`. Click the + circle button to create a new key.

![Certificates, Identifiers & Profiles](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs2.png)

Give it a name and enable the `Apple Push Notifications service (APNs)`. Choose `Continue` and on the next screen choose `Register`.

![Apple Push Notifications service (APNs)](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs3.png)

It is important to record the following three elements from this page:

- Select `Download` to save the `p8` file locally. You will need to upload this to `Firebase`. You will not be able to download this certificate by leaving this page.
- Copy and save the `Key ID`.
- Copy and save your membership ID. It is located next to your name in the upper right corner of the Membership Center or in the `Membership Details` section.

![Command id and key id](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs4.png)

### Setting up a Firebase project

You need to connect the `p8` certificate to your application in `Firebase`. In your `Firebase` project, select the gear next to `Project Overview` and select `Project settings`:

![Firebase settings](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs5.png)

Then set up your iOS app in the `General` section of your project settings. Do all the operations indicated:

![Add ios app](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs6.png)

Then upload your `p8` certificate by going to `Cloud Messaging` in the `Firebase` project settings. In the `APNs Authentication Key` section, select `Upload`.

![Add APNs Authentication Key](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs7.png)

Enter the details that you saved in the step of creating the `p8` certificate.

## iOS

Add Capabilities : `Background Mode` - `Remote Notifications`
Go into your `MyReactProject/ios` dir and open `MyProject.xcworkspace` workspace with xcode. Select the top project `MyProject` and select the `Signing & Capabilities` tab. Add a 2 new Capabilities using `+` button:

![Apple XCode Capabilities](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs8.png)

`Background Mode` capability and tick `Remote Notifications`.
`Push Notifications` capability

![Background mode](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs9.png)

![Push Notifications](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs10.png)

![Remote Notifications](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs11.png)

## Connecting the package to your project

### server

```js
import { initFirebaseApp, initPushNotifications } from '@startupjs/push-notifications/server'
import { getPushNotificationsRoutes } from '@startupjs/push-notifications/isomorphic'
const serviceAccountPath = path.join(process.cwd(), 'path/to/serviceAccountKey.json')
...
init({ orm })
initFirebaseApp(serviceAccountPath)

...
startupjsServer({
...
appRoutes: [
  ...
  ...getPushNotificationsRoutes()
]
}, (ee, options) => {
  ...
  initPushNotifications(ee)
  ...
}

```
You can generate a `serviceAccount` in the `Firebase` [console](https://console.firebase.google.com/project/) of your application. Open the `Service accounts` tab and click `Generate new private key`.

![Generate private key](https://startupjs-ui.dmapper.co/img/docs/push-notifications/pushs1.png)

### client

Call `initPushNotifications` in the place where you need to initialize the device token of the current user (devices are written based on the userId from the current session). It makes sense to perform initialization only for an authorized user. But, if necessary, initialization is allowed for each visitor, for this functions can be called directly in the `useGlobalInit` callback of `App`.

```js
import { initPushNotifications, notifications } from '@startupjs/push-notifications'
...

App(
  ...
  apps={ ..., notifications }
  useGlobalInit=() => {
    initPushNotifications()
    return true
  }
)
```

## Usage server API

### `initPushNotifications (ee)`
Initialization of push notifications on the server.

**Arguments**
  `ee (Object)` - eventEmitter of server.

**Example**

```js
startupjsServer({ ... }, (ee, options) => {
  ...
  initPushNotifications(ee)
  ...
}
```

### `initFirebaseApp(serviceAccount)`
Initialization of the `Firebase` application. How to create a `serviceAccount` see [above](/docs/libraries/push-notofications#server).

**Arguments**
  `serviceAccountPath (String)` - the absolute path to `serviceAccount`.

**Example**

```js
import { initFirebaseApp, initPushNotifications } from '@startupjs/push-notifications/server'

init({ orm })
initFirebaseApp(serviceAccountPath)
```

### `sendNotification (userIds, options)`
The function of sending push notifications. Same as [client function](/docs/libraries/push-notofications#send-notification-user-ids-options).

## Usage client API

### `initPushNotifications (options)`
function of initializing push notifications.

**Arguments**
  `options [Object]` - an options object for initializing push notifications. A complete list of options can be found in the [documentation](https://github.com/zo0r/react-native-push-notification#usage). !!IMPORTANT!! It is highly discouraged to override the `onRegister` and` onNotification [Function]` fields as this may break the package's behavior.

**Example**

```js
App(
  ...
  useGlobalInit=() => {
    initPushNotifications()
    return true
  }
)
```

### `sendNotification (userIds, options)`
function for sending notifications.

**Arguments**
`userIds [Array]` - array of user id to which push notification will be sent.

`options [Object]`:
  - `title [String]` - header string.
  - `body [String] (required)` - content string.
  - `platforms [Array]` - an array of platforms to send notification to. If not specified, the message will be sent to all registered devices.


**Example**

```js
function getPlan (id) {
  // WARNING: This is abstract example
  // This can be any function of yours
  return { name: 'silver' }
}

async function subscribe (planId) {
  const plan = getPlan(planId)
  // plan subscription logic
  await sendNotification([userId], { title: 'Subscription ', body: `You have subscribed to plan ${plan.name}`, platforms: ['ios', 'android']})
}
```
