# Общая

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
import { Strategy as CommonStrategy } from '@startupjs/auth-common/server'
```

В startupjsServer, в стратегии функции initAuth нужно добавить CommonStrategy:
```js
initAuth(ee, {
  strategies: [
    new CommonStrategy({
      providerName: 'virgin',
      authorizationURL: 'http://virgin.example.com/oauth/authorize',
      tokenURL: 'http://virgin.example.com/oauth/token',
      profileURL: 'http://virgin.example.com/oauth/get-me',
      clientId: 'e710f1a6-e43f-4775-ab85-5ab496167bb4',
      clientSecret: '7e2031ac-f634-467b-8105-707ffb46e879'
    })
  ]
})
```
**providerName** - имя за котором будет закреплена стратегия, к примеру в AzureADStrategy - это azuread, на основе этого имени, создается callback роут

**authorizationURL** - ссылка для подтверждения входа. Обычно при переходе на нее показывается диалоговое окно, в котором оповещается какие данные пользователя будут использованы на сайте

**tokenURL** - ссылка для получения токена доступа

**profileURL** - ссылка для получения данных юзера, с токеном доступа

## Инициализация в верстке
```js
import { AuthButton as VirginAuthButton } from '@startupjs/auth-common'
```

```jsx
return pug`
  VirginAuthButton(
    label='Virgin'
    providerName='virgin'
    style={ backgroundColor: '#e1090d' }
    imageUrl=BASE_URL + '/img/virgin.png'
  )
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
    <GoogleAuthButton />,
    <LinkedinAuthButton />,
    <VirginAuthButton
      label='Virgin',
      providerName='virgin',
      style={{ backgroundColor: '#e1090d' }},
      imageUrl={BASE_URL + '/img/virgin.png'}
    />
  ]
})
```
