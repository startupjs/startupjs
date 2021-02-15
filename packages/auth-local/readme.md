import { LoginForm, RecoverForm, RegisterForm, ChangePasswordForm } from '@startupjs/auth-local'
import Joi from '@hapi/joi'
import { Button } from '@startupjs/ui'

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

## LoginForm
Форма для авторизации
```js
import { LoginForm } from '@startupjs/auth-local'
```

Принимает пропсы:
- **baseUrl**: задать base url для формы
- **redirectUrl**: задать redirect url после авторизации
- **onSuccess**: callback вызывается после успешной авторизации
- **onError**: callback вызывается при ошибке авторизации
- **onChangeSlide**: получает имя слайда после клика на actions
```jsx example
return <LoginForm />
```

**Кастомизация:**
Пропсы для кастомизации:
- **properties**: работает по принципу `properties` из ObjectInput, можно добавить новые поля или заоверайдить стандартные
- **validateSchema**: проп для описания [joi](https://joi.dev/api/) схемы, передавать нужно объект как в примере. Так же, если добавляется новая форма, для нее всегда должна быть описана схема
- **renderActions**: функция которая возвращает новую верстку для actions

```jsx example
function renderActions ({ onSubmit }) {
  return pug`
    Button(
      style={ marginTop: 16 }
      onPress=onSubmit
    ) Login
  `
}

return pug`
  LoginForm(
    properties={
      age: {
        input: 'number',
        label: 'Age',
        placeholder: 'Enter your age'
      }
    }
    validateSchema={
      age: Joi.number()
        .required()
        .messages({
          'any.required': 'Fill in the field',
          'string.empty': 'Fill in the field'
        })
    }
    renderActions=renderActions
  )
`
```

## RegisterForm
Форма для регистрации
```js
import { RegisterForm } from '@startupjs/auth-local'
```

Принимает пропсы:
- **baseUrl**: задать base url для формы
- **redirectUrl**: задать redirect url после авторизации
- **onSuccess**: callback вызывается после успешной авторизации
- **onError**: callback вызывается при ошибке авторизации
- **onChangeSlide**: получает имя слайда после клика на actions

```jsx example
return <RegisterForm />
```

**Кастомизация:**
Пропсы для кастомизации:
- **properties**: работает по принципу `properties` из ObjectInput, можно добавить новые поля или заоверайдить стандартные
- **validateSchema**: проп для описания [joi](https://joi.dev/api/) схемы, передавать нужно объект как в примере. Так же, если добавляется новая форма, для нее всегда должна быть описана схема
- **renderActions**: функция которая возвращает новую верстку для actions

```jsx example
function renderActions ({ onSubmit }) {
  return pug`
    Button(
      style={ marginTop: 16 }
      onPress=onSubmit
    ) Sign In
  `
}

return pug`
  RegisterForm(
    properties={
      age: {
        input: 'number',
        label: 'Age',
        placeholder: 'Enter your age'
      }
    }
    validateSchema={
      age: Joi.number()
        .required()
        .messages({
          'any.required': 'Fill in the field',
          'string.empty': 'Fill in the field'
        })
    }
    renderActions=renderActions
  )
`
```

## RecoverForm
Форма для смены пароля
```js
import { RecoverForm } from '@startupjs/auth-local'
```
```jsx example
return <RecoverForm />
```
