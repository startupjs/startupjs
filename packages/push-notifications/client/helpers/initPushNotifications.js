import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotification from 'react-native-push-notification'
import { $root } from 'startupjs'
import registerDevice from './registerDevice'

let isInited = false

export default function initPushNotifications (options) {
  if (isInited) {
    console.warn('[@startupjs/push-notifications]: Re-calling initPushNotifications. You must call this method once in the whole application.!')
    return
  }
  isInited = true

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: async function (token) {
      const userId = $root.get('_session.userId')
      await registerDevice(userId, token)
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      PushNotification.localNotification({
        channelId: notification.channelId,
        id: notification.id,
        title: notification.title,
        message: notification.message
      })

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },
    onAction: function (notification) {
      console.log('ACTION:', notification.action)
      console.log('NOTIFICATION:', notification)
    },
    onRegistrationError: function (err) {
      console.error(err.message, err)
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    popInitialNotification: true,
    requestPermissions: true,

    ...options
  })

  // It need to set a default channel, since android receives notifications only through channels
  PushNotification.createChannel({
    channelId: 'default',
    channelName: 'Default channel'
  })
}
