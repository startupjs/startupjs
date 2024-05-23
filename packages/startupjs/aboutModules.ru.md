## Узнайте больше о системе плагинов:
- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Как создать плагин](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/createPlugin.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)


# Модули в Startupjs

Мы уже знаем, что startupjs дает возможность кастомизировать приложение с помощью плагинов. И в большинстве случаев этого будет достаточно. Но что делать, если наш плагин содержит в себе такой функционал, который тоже хотелось бы кастомизировать? Например, мы написали плагин для пакета Auth. При этом сам auth дает возможность подключать разные стратегии авторизации. И это совсем не означает, что они нам нужны сразу все. В такой ситуации, мы можем создать модуль auth, в котором уже будут подключаться свои плагины, каждый из которых будет реализовывать свою стратегию. Для каждого модуля мы можем создавать несколько плагинов.

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







## Узнайте больше о системе плагинов:
- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Как создать плагин](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/createPlugin.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)
