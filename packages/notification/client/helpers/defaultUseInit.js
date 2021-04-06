import OneSignal from 'react-native-onesignal'

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
