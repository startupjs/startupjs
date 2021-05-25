// AnroidManifest.xml
const permisionsString = `
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>`

const aplicationBodyString = `
<!-- Change the value to true to enable pop-up for in foreground on receiving remote notifications (for prevent duplicating while showing local notifications set this to false) -->
  <meta-data  android:name="com.dieam.reactnativepushnotification.notification_foreground"
              android:value="false"/>

  <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationActions" />
  <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />
  <receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationBootEventReceiver">
      <intent-filter>
          <action android:name="android.intent.action.BOOT_COMPLETED" />
          <action android:name="android.intent.action.QUICKBOOT_POWERON" />
          <action android:name="com.htc.intent.action.QUICKBOOT_POWERON"/>
      </intent-filter>
  </receiver>

  <service
      android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService"
      android:exported="false" >
      <intent-filter>
          <action android:name="com.google.firebase.MESSAGING_EVENT" />
      </intent-filter>
  </service>`

// build.gradle
const androidBuildGradleDeps = `
        classpath('com.google.gms:google-services:4.3.3')`

// app/build.gradle
const appGradleBuildHeader = `
apply plugin: 'com.google.gms.google-services'
`

const appGradleBuildDeps = `
    implementation platform('com.google.firebase:firebase-bom:27.1.0')
    implementation 'com.google.firebase:firebase-analytics:17.3.0'
`

// iOS

// AppDelegate.h

const appDelegateHHeader = '#import <UserNotifications/UNUserNotificationCenter.h>\n'

const appDelegateHDeps = '@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>\n'

// AppDelegate.m

const appDelegateMHeader = `
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
@import Firebase;
`

const implementationBody = `
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  [FIRApp configure];
`

const appDelegateMDeps = `
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
`

const podFile = `\n
pod 'Firebase/Messaging'
`

module.exports = {
  permisionsString,
  aplicationBodyString,
  androidBuildGradleDeps,
  appGradleBuildHeader,
  appGradleBuildDeps,
  appDelegateHHeader,
  appDelegateHDeps,
  implementationBody,
  appDelegateMHeader,
  appDelegateMDeps,
  podFile
}
