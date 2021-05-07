import PushNotification from 'react-native-push-notification'

const defaultCallback = (created) => console.log(`createChannel returned '${created}'`) // callback returns whether the channel was created, false means it already existed.

export default function initAndroidChannel (options, callback = defaultCallback) {
  PushNotification.createChannel(
    {
      ...options
    },
    callback
  )
}
