import { LoginForm, RecoverForm, RegisterForm } from '@startupjs/auth-local'

# Локальная авторизация

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Установка зависимостей
`yarn add @startupjs/auth-local`

## Force compile
В webpack.server.config.cjs -> forceCompileModules добавить:
`@startupjs/auth-local/server`

В webpack.web.config.cjs -> forceCompileModules добавить:
`@startupjs/auth-local`

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'
```

```js
initAuth(ee, {
  strategies: [
    new LocalStrategy({
      onCreatePasswordResetSecret: (userId, secret) => {
        // callback
      },
      onPasswordReset: userId => {
        // callback
      },
      onPasswordChange: userId => {
        // callback
      },
      onCreateEmailChangeSecret: (userId, secret) => {
        // callback
      },
      onEmailChange: userId => {
        // callback
      }
    })
  ]
})
```

## Компоненты
### LoginForm
Форма для авторизации
```js
import { LoginForm } from '@startupjs/auth-local'
```
```jsx example
return <LoginForm />
```

### RecoverForm
Форма для смены пароля
```js
import { RecoverForm } from '@startupjs/auth-local'
```
```jsx example
return <RecoverForm />
```

### RegisterForm
Форма для регистрации
```js
import { RegisterForm } from '@startupjs/auth-local'
```
```jsx example
return <RegisterForm />
```
