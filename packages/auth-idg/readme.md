# Авторизация через iDecisionGames

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования

```
@startupjs/auth: >= 0.33.0
react-native-webview: 10.10.2
```

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
