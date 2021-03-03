import { AuthForm, LogoutButton, onLogout } from './'
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
import * as localForms from '@startupjs/auth-local'
import { Button } from '@startupjs/ui'

# Авторизация

## Требования

```
@react-native-async-storage/async-storage: >= 1.13.2
react-native-restart: >= 0.0.19
@startupjs/ui: >= 0.33.0
lodash: 4.x
startupjs: >= 0.33.0
```

## Описание


## Инициализация на сервере
```js
import { initAuth } from '@startupjs/auth/server'
```

В тело функции startupjsServer, нужно добавить:
```js
initAuth(ee, {
  strategies: [
    new LocalStrategy({}),
    new FacebookStrategy({
      clientId: conf.get('FACEBOOK_CLIENT_ID'),
      clientSecret: conf.get('FACEBOOK_CLIENT_SECRET')
    })
  ]
})
```
Вместо LocalStrategy и FacebookStrategy - стратегии которые вам нужны

## Micro frontend
В auth есть готовые страницы для авторизации.

Чтобы их использовать:
1 - Перейти в Root/index.js
2 - Импорт функции initAuthApp, это функция получает компоненты нужных стратегий, для их валидного отображения в дальнейшем
```js
import { initAuthApp } from '@startupjs/auth'
```

3 - Импорт нужных компонентов, например:
```js
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin'
import * as localForms from '@startupjs/auth-local'
```

4 - Сгенерировать micro frontent для авторизации
```js
const auth = initAuthApp({
  localForms,
  socialButtons: [
    AzureadAuthButton,
    LinkedinAuthButton
  ]
})
```

5 - Передать в App
```pug
App(apps={ auth, main })
```

6 - Добавить роутеры на сервер
```js
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
//...
appRoutes: [
  ...getAuthRoutes()
]
//...
```

[Тестовый пример](/auth/sign-in)

## Общий компонент
Общая форма с нужными видами авторизации

```js
import { AuthForm } from '@startupjs/auth'
```

```jsx example
return (
  <AuthForm
    localForms={localForms}
    socialButtons={[
      GoogleAuthButton,
      LinkedinAuthButton
    ]}
  />
)
```

## Кнопка и хэлпер "Выйти"
Пример использования

```js
import { LogoutButton } from '@startupjs/auth'
```
```jsx example
return <LogoutButton />
```

или

```js
import { onLogout } from '@startupjs/auth'
```
```jsx example
return <Button onPress={onLogout}>Выйти</Button>
```


## Редирект после авторизации
Компонент чтобы правильно сделать редирект после авторизации на вебе и мобильном приложении
```js
import { SuccessRedirect } from '@startupjs/auth'
```

Для использования нужно обернуть Layout
```jsx
function Layout ({ children }) {
  return pug`
    SuccessRedirect
      = children
  `
}
```

Задать путь редиректа при инициализации на сервере
```js
initAuth(ee, {
  successRedirectUrl: '/profile',
})
```
