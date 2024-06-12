## Узнайте больше о системе плагинов:
- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Как создать плагин](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/createPlugin.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)

# Документация в разработке

# Модули в Startupjs

Мы уже знаем, что startupjs дает возможность кастомизировать приложение с помощью плагинов. И в большинстве случаев этого будет достаточно. Но что делать, если наш плагин содержит в себе такой функционал, который тоже хотелось бы кастомизировать? Например, мы написали плагин для пакета Auth. При этом сам auth дает возможность подключать разные стратегии авторизации (например, google, linkedIn и другие). В такой ситуации, мы можем создать модуль auth из нашего плагина auth, в котором уже будут подключаться свои плагины, каждый из которых будет реализовывать свою стратегию. Для каждого модуля мы можем создавать несколько плагинов. Пользователю достаточно будет установить пакет из startupjs, например startupjs/auth-google (название дано чисто для примера), и этот пакет будет автоматически подключен. Не надо будет ничего дополнительно настраивать.

Вся концепция модулей (как и плагинов) - это по сути концепция event-эмиттеров, где модуль - это наш event emitter, который имитить события, а плагины - это функция on для подписки на события.
Плагины для модуля - это просто функция on для подписки на события.

## Как создать модуль?

Модули создаются по такому же принципу, как и плагины. Для этого используется функция createModule из пакета startupjs/registry.

Создайте файл модуля с именем module.js или myModule.module.js (вместо myModule вы можете указать любое другое название файла, но обязательно должна присутствовать вторая часть названия файла ".module.js").

myModule.module.js

```js
  import { createModule } from 'startupjs/registry'

  export default createModule({
    // name - уникальное название модуля
    name: 'admin'
  })
```

Добавьте информацию об этом файле в раздел `exports` файла `package.json` под именем `module` или `myModule.module.js`, чтобы он автоматически загружался в ваше приложение. Если модуль лежит в отдельной папке, то необходимо учесть путь:

```json
  "exports": {
    "./module": "./module.js",
    "./modules/myModule.module.js": "./modules/myModule.module.js"
  }
```

Для того, чтоб "привязать" плагин к нужному модулю, используется свойство for у плагина. Об этом подробнее рассказано в документации о плагинах. Но если в двух словах, то вы просто указываете для for название модуля. Если for не указан, то модулем будет выступать сам startupjs, как корневой модуль.



## Узнайте больше о системе плагинов:
- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Как создать плагин](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/createPlugin.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)
