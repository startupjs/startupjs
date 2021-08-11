# Авторизация через Google

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
@react-native-google-signin/google-signin: >= 6.0.0
@startupjs/auth: >= 0.33.0
```

## Создание и настройка приложения
1 - Создать аккаунт [Firebase](https://console.firebase.google.com/), если еще не создан.
2 - Далее во вкладке **Authentication**, включить авторизацию через **Google**.
3 - Скопировать из **"Настройка SDK для веб-клиента"** в config.json:
**Идентификатор веб-клиента** - как `GOOGLE_CLIENT_ID`
**Секрет веб-клиента** - как `GOOGLE_CLIENT_SECRET`
4 - Далее навести на **?** после текста **"Настройка SDK для веб-клиента"**, кликнуть по **Google API Console**
5 - Заходим в **Web client (auto created by Google Service)**, в **URI** нужно поменять `localhost:5000` на `localhost:3000`
6 - Добавить в **Разрешенные URI перенаправления** -
`http://localhost:3000/auth/google/callback`

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as GoogleStrategy } from '@startupjs/auth-google/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
```

В startupjsServer, в стратегии функции initAuth нужно добавить GoogleStrategy, с переменными из конфига:
```js
initAuth(ee, {
    strategies: [
        new GoogleStrategy({
            clientId: conf.get('GOOGLE_CLIENT_ID'),
            clientSecret: conf.get('GOOGLE_CLIENT_SECRET'),
        })
    ]
})
```

## Использование на мобильных приложениях
**BASE_URL** должен ВЕЗДЕ (.env, config.json) быть - `http://localhost:3000`

## Android
1 - В **Firebase** на главной странице проекта добавить Android приложение
2 - Валидное название пакета в - `android/app/src/main/java/com/auth/MainActivity.java`, первой строчкой - package НАЗВАНИЕ_ПАКЕТА
3 - Скачать **google-services.json**, закинуть в папку - `android/app`
4 - Нужно сгенерировать ключи (вызвать из главной папки):

keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android

5 - Далее в настройки Firebase проекта, клик по шестеренке - **"Настройки проекта"**
6 - Для приложения адроид есть кнопка добавить **"Добавить контрольную сумму"**, клик на нее, откроется поле для ввода сгенерированных ключей, вводим SHA1 и SHA256

## iOS
1 - В **Firebase** на главной странице проекта добавить iOS приложение
2 - Валидный идентификатор пакета - можно посмотреть через xCode (н-р: `org.reactjs.native.example.auth`)
3 - Скачать - **GoogleService-Info.plist**
4 - Загрузить его в проект **через xCode** в папку где находится AppDelegate
5 - В xCode зайти в **Info**, найти **URL Types**
В **URL Types** добавить новый тип и ему в **URL Sheme** прописать `REVERSED_CLIENT_ID` из **GoogleService-Info.plist**
6 - Обновить зависимости `cd ios && pod install`

## Инициализация в верстке
Можно использовать компонент
```js
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google/client'
```

Либо хелпер
```js
import { onLogin } from '@startupjs/auth-google/client'
```
```pug
Div.custom(onPress=onLogin)
```
