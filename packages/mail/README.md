# Mail service

## Установка

```sh
yarn add @startupjs/mail
```

или

```sh
npm i @startupjs/mail
```

## Конфигурация

### Add module to be force compiled by webpack

```
  // webpack.server.config.js
  const getConfig = require('startupjs/bundler.cjs').webpackServerConfig

  module.exports = getConfig(undefined, {
    forceCompileModules: [
      "@startupjs/mail"
    ],
    alias: {}
  })
```

### Init mail service:
  Для инициализации используйте функцию: initMail(ee, options)

  Пример:
  ```js
  import initMail from '@startupjs/mail/server'

  ...

  startupjsServer({
    ...
  }, (ee, options) => {
    initMail(ee, {
      defaultProvider: 'mailgun',
      providers: {
        mailgun: new MailgunProvider({
            apiKey: '',
            domain: ''
          })
      },
      templates: {
        exampleTemplate: require('../emails/exampleTemplate').default
      },
      layouts: {
        exampleLayout: require('../emails/layouts/exampleLayout').default
      }
    })
  })
  ```

  ### Параметры initMail:

  - defaultProvider - Имя провайдера который будет использоваться как основной.
  - providers - Объект с провайдерами
  - layouts - Объект с лейаутами
  - templates - Объект с шаблонами

### Провайдеры
  Для инициализайтии провайдеров используйте параметр providers функции initMail.

  Провайдером должен быть класс с методом send в который будут переданы данные
  необходимые для отправки письма.

  Объект данных которые получит метод send провайдера:
    from - Может быть любая строка с которой умеет работать ваш мейл сервис.
      Этот параметр можно задать в config.json в поле: 'MAILGUN_FROM_ID',
      или передать при вызове функции sendEmail

    senderEmail - Строка с email'ом который будет вычеслен если в sendEmail передать
      параметры: senderId || domain || host

    to - Массив с email'ами получателей

    subject - Тема письма
    text
    html - HTML письма
    inline - Встроенное изображение в контент письма (путь к изображению)
  }

### Layouts
  Для инициализайтии лейаутов используйте параметр layouts функции initMail.

  Лейаутом должна быть функция которая получает в аргументы model и options,
  и должна возвращать объект вида

  ```
  {
    html, // String
    ignoreUnsubscribed // Bool
  }
  ```

  html - Верстка layout'а в которую необходимо добавить подстроку: %{content}%.
    %{content}% будет заменен на html шаблона или html функции sendEmail

  ignoreUnsubscribed - если true, то пользователь который отписался от
    рассылки сообщений все равно получит это письмо.

  По умолчанию используется пустой layout.

  ## Пример layout'a

    ```js
      const html = `
        <div>
          <h1> My awesome layout! </h1>
          %{content}%
        </div>
      `

      export default function exampleLayout (model, options) {
        return { html, ignoreUnsubscribed: false }
      }
    ```

  При необходимости использовать не инициализированые в initMail layout'ы
  их можно зарегистрировать с помощью registerLayouts которая принимает
  в аргументы объект с нужными layout'ами такого же вида как
  initMail({ layouts: {...} })

  ```js
  import registerLayoutExample from '../../emails/layouts/registerLayoutExample'
  import { registerLayouts } from '@dmapper/mail/server'
  ...
  registerLayouts({
    exampleLayout: registerLayoutExample
  })
  ```

  ## Templates

  Для инициализайтии темплейтов используйте параметр templates функции initMail.

  Темплейтом должна быть функция которая получает в аргументы model и options
  и должна возвращать объект вида

  ```
  {
    html, // String
    subject // String
  }
  ```

  html - Верстка template'а

  subject - тема письма

  ## Пример template'a

    ```js
      function templateExample (model, options) {
        return { html: `<p>${options.text}</p>`, subject: 'Example' }
      }
    ```

  При необходимости использовать не инициализированые в initMail templat'ы
  их можно зарегистрировать с помощью registerTemplates функции которая принимает
  в аргументы объект с нужными template'ами такого же вида как
  initMail({ templates: {...} })

  ```js
  import registerLayoutExample from '../../emails/layouts/registerLayoutExample'
  import { registerLayouts } from '@dmapper/mail/server'
  ...
  registerLayouts({
    exampleLayout: registerLayoutExample
  })
  ```

## Использование

### Использование на сервере

```sh
  import { sendEmail } from '@startupjs/mail/server'

  ...
  sendEmail(model, options)
  ...
```

### Использование на клиенте

```sh
  import { sendEmail } from '@startupjs/mail'

  ...
  sendEmail(options)
  ...
```

### sendEmail function options (both for server and client)

Обязательные
- from - Может быть любая строка с которой умеет работать ваш мейл сервис.
    Этот параметр можно так же задать в config.json в поле: 'MAILGUN_FROM_ID'.
- senderId - id пользователя отправившего письмо
- to - Строка с email адресами получатетелей разделенная запятой с пробелом ('mail1@mail.com, mail2@mail.com')
- ignoreWhitelist - включить/отключить ограничения отправки эмейлов (только для stage === DEV)
- subject - Тема письма (Заменяется subject'ом из template)
- html - контент письма в виде html строки (Заменяется html из template)
- template - имя template'а
- templateOptions - Опции которые будут переданы в функцию template'а
- inline - Встроенное изображение в контент письма (путь к изображению)
```js
  const filepath = path.join(__dirname, 'test.jpg')
  const options = {
    html: '<html>Inline image here:<img src="cid:test.jpg"></html>',
    inline: filepath
    //...other options
  }
```
- recipientIds - Массив id'шек получателей письма
- layout - Имя layout'a который будет использован (По умолчанию пустой)
- layoutOptions - Опции которые будут переданы в функцию layout'а
- provider - Имя провайдера из конфига который будет использован для отправки письма
- domain - домен

## Отписка от рассылки

  Перед отправкой сообщения происходит проверка поля 'emailSettings.unsubscribed' в документе из колекции auth, который ищется по email'у, на наличие свойства
