import PushNotification from 'react-native-push-notification'

export default function initAndroidChannel (options, callback = () => null) {
  PushNotification.createChannel(
    {
      ...options
    },
    callback
  )
}
