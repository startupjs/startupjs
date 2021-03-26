import { useState } from 'react'
import { AuthForm, LogoutButton, onLogout } from './'
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
import { LoginForm, RegisterForm, RecoverForm } from '@startupjs/auth-local'
import { Button } from '@startupjs/ui'

# Авторизация

## Требования

```
@react-native-async-storage/async-storage: >= 1.13.2
react-native-restart: >= 0.0.22
@startupjs/ui: >= 0.33.0
startupjs: >= 0.33.0
```

## Описание


## Инициализация на сервере
```js
import { initAuth } from '@startupjs/auth/server'
```

В теле функции startupjsServer происходит инициальзация модуля, в strategies - добавляются стратегии каждая со своим набором характеристик:
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

## Micro frontend
[Тестовый пример](/auth/sign-in)
(ключи apple и azure скрыты из публичного доступа и их нужно добавлять вручную)

Представляет собой готовые страницы с формами, которые можно подключить на сайт

Чтобы их использовать, нужно в файле Root/index.js (либо где используется startupjs/app), заинитить микро фронтент и положить его в App компонент

Для начала нужна функция инициализатор, которая принимает нужные опции:
```js
import { initAuthApp } from '@startupjs/auth'
```

Основные ее опции - это socialButtons и localForms, которые собирают нужные компоненты для общей формы. Т.к. заранее неизвестно какие стратегии должны быть подключены, приходиться подключать их самим. Кнопки есть практически у каждой стратегии, кроме локальной, чтобы ознакомиться какие компоненты существуют для auth-local, есть отдельное описание для этой стратегии (сообственно как и для всех других).

Импорт нужных компонентов:
```js
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin'
import { LoginForm, RegisterForm, RecoverForm } from '@startupjs/auth-local'
```

Все базируется на локальной стратегии. Она имеет 3 стандартных формы: Авторизация, Регистрация, Восстановление пароля. Между этими формами происходит переключение под капотом.
Микрофронтенд имеет 3 обязательных роута для локальной стратегии: 'sign-in', 'sign-up' и 'recover', собственно при использовании локальной формы, всегда нужно чтобы по этим ключам были установлены компоненты с формами.

```jsx
const auth = initAuthApp({
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  },
  socialButtons: [
    <AzureadAuthButton />,
    <LinkedinAuthButton />
  ]
})
```

Когда микрофронтенд сгенерирован, нужно просто передать его в App
```pug
App(apps={ auth, main })
```

И так же добавить роуты для сервере
```js
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
//...
appRoutes: [
  ...getAuthRoutes()
]
//...
```

### Кастомизация микрофронтенда
Можно изменить `Layout`. К примеру у сайта есть своя шапка, лого, фон и т.д.
Для этого можно прокинуть кастомный Layout в опции микрофронтенда:

```jsx
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  }
})
```

Поскольку в localForms и socialButtons прокидывается jsx, все компоненты можно модифицировать как обычно:
```jsx
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm
      properties={{
        age: {
          input: 'number',
          label: 'Age',
          placeholder: 'Enter your age'
        }
      }}
      validateSchema={{
        age: Joi.string().required().messages({
          'any.required': 'Fill in the field',
          'string.empty': 'Fill in the field'
        })
      }}
    />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  },
  socialButtons: [
    <GoogleAuthButton
      label='Sign in with Google'
    />,
    <FacebookAuthButton
      label='Sign in with Facebook'
    />
  ]
})
```

Подробно о кастомизации этих компонентов описано на страницах с нужными стратегиями

Если нужно изменить стандартные заголовки и сделать свою разметку, можно применить функцию renderForm:
```jsx
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm />,
    'recover': <RecoverForm />
  },
  socialButtons: [
    <GoogleAuthButton />,
    <FacebookAuthButton />
  ],
  renderForm: function ({
    slide,
    socialButtons,
    localActiveForm,
    onChangeSlide
  }) {
    return pug`
      Div
        H5= getCaptionForm(slide)
        = socialButtons
        Div(style={ marginTop: 16 })
          = localActiveForm
    `
  }
})
```

Она получает те формы которые объявлены, и текущий слайд

## Общий компонент
Общая форма с нужными видами авторизации
Все тоже самое что и для микрофронтенда, только нет роутов, и переключение слайдов нужно настроить самим

```js
import { AuthForm } from '@startupjs/auth'
```

```jsx example
const [slide, setSlide] = useState('sign-in')

return (
  <AuthForm
    slide={slide}
    localForms={{
      'sign-in': <LoginForm />,
      'sign-up': <RegisterForm />,
      'recover': <RecoverForm />
    }}
    socialButtons={[
      <GoogleAuthButton label='Sign in with Google' />,
      <LinkedinAuthButton />
    ]}
    onChangeSlide={slide=> setSlide(slide)}
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
Задать путь редиректа при инициализации на сервере
```js
initAuth(ee, {
  successRedirectUrl: '/profile',
})
```
