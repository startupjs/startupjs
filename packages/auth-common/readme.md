# Общая

## Инициализация главного модуля
[Настройка главного модуля](/docs/auth/main)

## Установка зависимостей
`yarn add @startupjs/auth-common`
`yarn add react-native-webview`

## Force compile
В webpack.server.config.cjs -> forceCompileModules добавить:
`@startupjs/auth-common/server`

В webpack.web.config.cjs -> forceCompileModules добавить:
`@startupjs/auth-common`

## Инициализация на сервере
Импорт стратегии:
```js
import { Strategy as CommonStrategy } from '@startupjs/auth-common/server'
```

В startupjsServer, в стратегии функции initAuth нужно добавить CommonStrategy:
```js
initAuth(ee, {
  strategies: [
    new CommonStrategy({
      providerName: 'virgin',
      authorizationURL: 'http://virgin-dev.dmapper.co/oauth/authorize',
      tokenURL: 'http://virgin-dev.dmapper.co/oauth/token',
      profileURL: 'http://virgin-dev.dmapper.co/oauth/get-me',
      clientId: 'e710f1a6-e43f-4775-ab85-5ab496167bb4',
      clientSecret: '7e2031ac-f634-467b-8105-707ffb46e879'
    })
  ]
})
```
**providerName** - имя за котором будет закреплена стратегия, к примеру в AzureADStrategy - это azuread, на основе этого имени, создается callback роут

**authorizationURL** - ссылка для подтверждения входа. Обычно при переходе на нее показывается диалоговое окно, в котором опевещается какие данные пользователя будут использованы на сайте

**tokenURL** - ссылка для получения токена доступа

**profileURL** - ссылка для получения данных юзера, с токеном доступа

## Инициализация в верстке
Поскольку зарание не известно какой сервис будет использоваться, можно создать кастомный компонент для кнопки, пример:

```js
import { createAuthButton } from '@startupjs/auth-common'
```

```jsx
const VirginAuthButton = createAuthButton({
  label: 'Virgin',
  providerName: 'virgin',
  style: { backgroundColor: '#e1090d' },
  imageUrl: BASE_URL + '/img/virgin.png'
})

return pug`
  VirginAuthButton
`
```
**label** - текст отображаемый в кнопке

**providerName** - то же самое что и у серверной стратегии

**style** - стили для кнопки

**imageUrl** - ссылка на изображение, рядом с label

Так же можно применить данную кнопку для микрофронтенда в initAuthApp:
```js
const auth = initAuthApp({
  socialButtons: [
    GoogleAuthButton,
    LinkedinAuthButton,
    createAuthButton({
      label: 'Virgin',
      providerName: 'virgin',
      style: { backgroundColor: '#e1090d' },
      imageUrl: BASE_URL + '/img/virgin.png'
    })
  ]
})
```
