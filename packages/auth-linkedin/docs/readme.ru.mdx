# Авторизация через Linkedin

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
@startupjs/auth: >= 0.33.0
react-native-webview: 10.10.2
```

## Настройка приложения
1 - Создать приложение по [ссылке](https://www.linkedin.com/developers)
2 - Во вкладке **Auth**, скопировать **Client ID** как `LINKEDIN_CLIENT_ID`, **Client Secret** как `LINKEDIN_CLIENT_SECRET`
3 - Добавить ссылки для редиректа, на вкладке **Authorized redirect URLs for your app**:
`http://localhost:3000/auth/linkedin/callback`
`http://localhost:3000/auth/linkedin/callback-native`
4 - Во вкладке **Products**, выбрать **Sign In with LinkedIn**

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as AzureadStrategy } from '@startupjs/auth-azuread/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
````

В startupjsServer, в стратегии функции initAuth нужно добавить LinkedinStrategy, с переменными из конфига:
```js
initAuth(ee, {
  strategies: [
    new LinkedinStrategy({
      clientId: conf.get('LINKEDIN_CLIENT_ID'),
      clientSecret: conf.get('LINKEDIN_CLIENT_SECRET')
    })
  ]
})
```
Так же доступна динамическая инициализаци стратегии, которая происходит каждый раз непосредственно в момент авторизации пользователя.

```js
initAuth(ee, {
  strategies: [
    new LinkedinStrategy({
      getClient: async function(req) {
        // ...
        return {
          id: '######',
          secret: '######'
        }
      },
    })
  ]
})
```

## Инициализация в верстке
```js
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
```
