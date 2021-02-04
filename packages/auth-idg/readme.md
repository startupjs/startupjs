# Авторизация через iDecisionGames

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Установка зависимостей
`yarn add @startupjs/auth-idg`
`yarn add react-native-webview`

## Force compile
В webpack.server.config.cjs -> forceCompileModules добавить:
`@startupjs/auth-idg/server`

В webpack.web.config.cjs -> forceCompileModules добавить:
`@startupjs/auth-idg`

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as IDGStrategy } from '@startupjs/auth-idg/server'
```

Импорт либы для конфига:
```js
import conf from 'nconf'
````

В startupjsServer, в стратегии функции initAuth нужно добавить IDGStrategy, с переменными из конфига:
```js
initAuth(ee, {
  strategies: [
    new IDGStrategy({
      clientId: conf.get('IDG_CLIENT_ID'),
      clientSecret: conf.get('IDG_CLIENT_SECRET')
    })
  ]
})
```

## Инициализация в верстке
```js
import { AuthButton as IDGAuthButton } from '@startupjs/auth-idg/client'
```
