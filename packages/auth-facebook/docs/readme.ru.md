# Авторизация через Facebook

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
@startupjs/auth: >= 0.33.0
react-native-fbsdk: >= 1.0.0
```

## Создание приложения
Создайте [здесь](https://developers.facebook.com/apps/) приложение для facebook.
Скопируйте **ID приложения** в config.json, как `FACEBOOK_CLIENT_ID`.
Далее в настройках, скопируйте **Секрет приложения** в config.json, как `FACEBOOK_CLIENT_SECRET`.

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as FacebookStrategy } from '@startupjs/auth-facebook/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
```

В startupjsServer, в стратегии функции initAuth нужно добавить FacebookStrategy, с переменными из конфига:
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

## Использование на мобильных приложениях
### Firebase
1 - Создать аккаунт [Firebase](https://console.firebase.google.com/), если еще не создан.
2 - Далее во вкладке **Authentication**, включить авторизацию через **Facebook** введя необходимые данные.
3 - Скопировать URI перенаправления, и вставить в [настройках приложения](https://developers.facebook.com/apps) (**Вход через Facebook** -> **Настройки** -> **Действительные URI перенаправления для OAuth**).

### Android
В `android/app/src/main/res/values`, нужно добавить (Где `FACEBOOK_CLIENT_ID` - id текущего приложения):
```xml
<string name="facebook_app_id">FACEBOOK_CLIENT_ID</string>
```
В `android/app/src/main/AndroidManifest.xml`, в тэг application, нужно добавить:
```xml
<meta-data
    android:name="com.facebook.sdk.ApplicationId"
    android:value="@string/facebook_app_id" />
```

В [Facebook developers](https://developers.facebook.com/apps), в настройках, в самом низу **"Добавить платформу"**, выбираем **Android**, далее жмем на кнопку **"Быстрое начало работы"**.
Вводим данные в нижней вкладке **"Расскажите о проекте для Android"**

Далее генерируем и вводим нужные ключи.

### iOS
Обновить зависимости `pod install`.

В **Info.plist**, в самый конец, до последних `</dict></plist>` нужно добавить:
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
FACEBOOK_CLIENT_ID - заменить на нужный id.
FacebookDisplayName - на нужный.

## Инициализация в верстке
Можно использовать компонент
```js
import { AuthButton as FacebookAuthButton } from '@startupjs/auth-facebook/client'
```

Либо хелпер
```js
import { onLogin } from '@startupjs/auth-facebook/client'
```

```pug
Div.custom(onPress=onLogin)
```
