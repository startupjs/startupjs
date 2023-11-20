# Авторизация через Apple

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
@invertase/react-native-apple-authentication: >= 2.1.0
@startupjs/auth: >= 0.33.0
```

## Настройка приложения
1 - Открыть проект в xCode
2 - Targets -> Signing & Capabilities
3 - Добавить команду
4 - Дабавить Capability - Sign in with Apple
5 - Перейти в [Identifiers](https://developer.apple.com/account/resources/identifiers/list/). Там должен появиться идентификатор
6 - Перейти в [Keys](https://developer.apple.com/account/resources/authkeys/list)
7 - Создать новый ключ. Выбрать **Sign in with Apple**. Во вкладке **Edit** - выбрать нужный **Primary App ID**
8 - После регистрации сохранить **Key ID** и скачать сертификат p8
9 - **Key ID** закинуть в config как `APPLE_KEY_ID``
10 - Перейти в [Services IDs](https://developer.apple.com/account/resources/identifiers/list/serviceId)
11 - Зарегестрировать Service ID, с любым ID
12 - Закинуть этот ID в **config.json** как `APPLE_CLIENT_ID`
13 - Заходим в него, ставим галочку **Sign In with Apple**
14 - Открываем **Configure**
15 - Ставим нужный **Primary App ID**
16 - Заполняем домен и callback urls. localhost Apple не принимает, для тестов можно использовать ngrok, н-р:
https://c48c1b8bb802.ngrok.io/auth/apple/callback,
https://c48c1b8bb802.ngrok.io/auth/apple/callback-native

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as AppleStrategy } from '@startupjs/auth-apple/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
````

В startupjsServer, в стратегии функции initAuth нужно добавить AppleStrategy, с переменными из конфига:
```js
initAuth(ee, {
  strategies: [
    new AppleStrategy({
      clientId: conf.get('APPLE_CLIENT_ID'),
      teamId: conf.get('APPLE_TEAM_ID'),
      keyId: conf.get('APPLE_KEY_ID'),
      privateKeyLocation: path.join(process.cwd(), 'путь к файлу p8')
    })
  ]
})
```

Для тестов можно использовать **testBaseUrl**

## Инициализация в верстке
```js
import { AuthButton as AppleAuthButton } from '@startupjs/auth-apple/client'
```
