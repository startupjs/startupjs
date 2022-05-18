import { LoginForm, RecoverForm, RegisterForm, ChangePasswordForm } from '@startupjs/auth-local'
import Joi from '@hapi/joi'
import { Button } from '@startupjs/ui'

# Локальная авторизация

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Требования
```
@startupjs/auth: >= 0.33.0
text-encoding-polyfill: >= 0.6.7
```

## Инициализация дополнительных модулей
В корневом index.js добавить:
```js
import 'text-encoding-polyfill'
```

## Подключение капчи
Если вы хотите добавить **reCaptcha** для форм регистрации и смены пароля, то выполните инструкции из [документации @startupjs/recaptcha](/docs/libraries/recaptcha#connecting-to-startup-js) и добавьте в `initAuth` параметр `recaptchaEnabled` в файле `server/index.js`:

```js
initAuth(ee, {
  // ...
  recaptchaEnabled: true,
  // ...
})
```

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'
```

```js
initAuth(ee, {
  strategies: [
    new LocalStrategy()
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

**Кастомизация**
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
- **recaptchaBadgePosition**: переместить значок reCAPTCHA
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

## Серверные хуки

### onBeforeRegister
Хэлпер-мидлвара, вызывается перед регистрацией

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeRegister: (req, res, next, opts) => {
        console.log('onBeforeRegister')
        next()
      }
    })
  ]
  // ...
}
```

### onAfterRegister
Хэлпер-мидлвара, вызывается после регистрации

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onAfterRegister: ({ userId }, req) => {
        console.log('onAfterRegister')
      }
    })
  ]
  // ...
}
```

### onBeforeCreatePasswordResetSecret
Хэлпер-мидлвара, вызывается перед созданием кода для сброса пароля

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeCreatePasswordResetSecret: (req, res, done) => {
        console.log('onBeforeCreatePasswordResetSecret')

        const { email } = req.body
        if (!email) return done('Missing email')
        done(null, email)
      }
    })
  ]
  // ...
}
```

### onCreatePasswordResetSecret
Хэлпер-мидлвара, вызывается при создании кода для сброса пароля

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onCreatePasswordResetSecret: ({ userId, secret }, req) => {
        console.log('onCreatePasswordResetSecret')
      }
    })
  ]
  // ...
}
```

### onBeforePasswordReset
Хэлпер-мидлвара, вызывается перед восстановлением пароля

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforePasswordReset: (req, res, next) => {
        console.log('onBeforePasswordReset')
        next()
      }
    })
  ]
  // ...
}
```

### onAfterPasswordReset
Хэлпер-мидлвара, вызывается после восстановления пароля

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onAfterPasswordReset: ({ userId }, req) => {
        console.log('onAfterPasswordReset')
      }
    })
  ]
  // ...
}
```

### onBeforePasswordChange
Хэлпер-мидлвара, вызывается перед изменением пароля

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforePasswordChange: (req, res, next) => {
        console.log('onBeforePasswordChange')
        next()
      }
    })
  ]
  // ...
}
```

### onAfterPasswordChange
Хэлпер-мидлвара, вызывается после изменения пароля

```jsx
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onAfterPasswordChange: ({ userId }, req) => {
        console.log('onAfterPasswordChange')
      }
    })
  ]
  // ...
}
```

### onBeforeConfirmRegistration
Хэлпер-мидлвара, вызывается перед процессом подтверждения регистрации

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeConfirmRegistration: (req, res, next) => {
        console.log('onBeforeConfirmRegistration')
      }
    })
  ]
  // ...
}
```

### onBeforeResendConfirmation
Хэлпер-мидлвара, вызывается перед повторной отправкой подтверждения по электронной почте

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      onBeforeResendConfirmation: (req, res, config, next) => {
        console.log('onBeforeResendConfirmation')
      }
    })
  ]
  // ...
}
```

### sendRegistrationConfirmationComplete
Хэлпер-мидлвара, вызывается после подтверждения регистрации

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      sendRegistrationConfirmationComplete: (userId, next) => {
        console.log('sendRegistrationConfirmationComplete')
      }
    })
  ]
  // ...
}
```

### confirmEmail
Хэлпер-мидлвара, реализует подтверждение регистрации

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      confirmEmail: (model, userId, config, next) => {
        console.log('confirmEmail')
      }
    })
  ]
  // ...
}
```

### sendRegistrationConfirmation
Хэлпер-мидлвара, вызывается после регистрации и при повторной отправке подтверждения по электронной почте. Вам необходимо переопределить эту функцию, если для параметра confirmRegistration установлено значение `true`, чтобы отправить электронное письмо со ссылкой для подтверждения регистрации.

```js
initAuth(ee, {
  // ...
  strategies: [
    new LocalStrategy({
      sendRegistrationConfirmation: (req, userId, next) => {
        console.log('sendRegistrationConfirmation')
      }
    })
  ]
  // ...
}
```
