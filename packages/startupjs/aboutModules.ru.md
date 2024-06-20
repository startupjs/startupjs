## Узнайте больше о системе плагинов:
- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Как создать плагин](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/createPlugin.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)

# Документация в разработке

# Модули в Startupjs
Мы уже знаем, что startupjs дает возможность кастомизировать приложение с помощью плагинов. И в большинстве случаев этого будет достаточно. Но что делать, если наш плагин содержит в себе такой функционал, который тоже хотелось бы кастомизировать? Например, мы написали плагин для пакета Auth. При этом сам auth дает возможность подключать разные стратегии авторизации (например, google, linkedIn и другие). В такой ситуации, мы можем создать модуль auth, в котором уже будут подключаться свои плагины, каждый из которых будет реализовывать свою стратегию. Для каждого модуля мы можем создавать несколько плагинов. Пользователю достаточно будет установить пакет из startupjs, например startupjs/auth-google (название дано для примера), и этот пакет будет автоматически подключен. Не надо будет ничего дополнительно настраивать.

Вся концепция модулей (как и плагинов) - это по сути концепция event-эмиттеров, где модуль - это наш event emitter, который имитит события, где вместо привычного нам emit выступает hook, а плагины - это функция on для подписки на события.
Единственное отличие от обычного EventEmitter это то, что наш event-эмиттер возвращает данные.

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

## Давайте разберем модули на примере создания модуля для админ-панели

Создадим файл с названием module.js, который будет содержать следующий код:

```js
  import { createModule } from 'startupjs/registry'

  export default createModule({
    name: 'admin'
  })
```

В этом файле мы импортируем функцию createModule из пакета 'startupjs/registry', с помощью которой дальше создаем сам модуль.

Наша админ-панель состоит из сайдбара и контентной части. Меню в сайдбаре не всегда будет одинаковым для разных приложений и часто нам придется добавлять уникальные пункты меню, либо формировать полностью свое. Для такого случая к нам на помощь приходят плагины, которыми мы можем расширить функционал модуля admin.

Для этого создадим папку admin-schema и в ней файл плагина

```js
  export default createPlugin({
    name: 'schema',
    for: 'admin',
    enabled: true,
    client: () => ({
      routes: () => [
        { path: 'schema', element: <Page /> },
        { path: 'test-page', element: <TestPage /> }
      ],
      menuItems: () => [
        { to: 'schema', name: 'Schema', icon: faTable },
        { to: 'test-page', name: 'TestPage', icon: faTable }
      ]
    })
  })
```

Так же сделаем плагин для корневого модуля startupjs, при установке которого у нас будут подключаться ендпоинты админ-панели:

```js
export const startupjsPlugin = createPlugin({
  name: 'admin-schema',
  enabled: true,
  server: () => ({
    api: expressApp => {
      expressApp.get(`${BASE_URL}/files`, files)
      expressApp.get(`${BASE_URL}/file/:filename`, getFile)
    }
  })
})
```

Теперь у нас есть модуль admin, в котором будут дефолтные страницы и если мы захотим добавить admin-schema, то просто установим плагин admin-schema, после чего нам будут доступны страницы и ендпоинты апи.

Для того, чтоб "привязать" плагин к нужному модулю, используется свойство for у плагина. Об этом подробнее рассказано в документации о плагинах. Но если в двух словах, то вы просто указываете для for название модуля. Если for не указан, то модулем будет выступать сам startupjs, как корневой модуль.

Как теперь это можно использовать в нашем модуле admin?

Изначально при создании модуля разработчик должен заложить возможность взаимодействия модуля с плагинами. Давайте разберем, как реализованы роуты в модуле admin

```js
  import { createElement as el } from 'react'
  import MODULE from '../module'
  import _layout from './_layout'
  import index from './index'

  export default [{
    path: '',
    element: el(_layout),
    children: [
      { path: '', element: el(index) },
      ...MODULE.hook('routes').flat()
    ]
  }]
```

Мы импортируем MODULE из файла, где мы его создали и у нас появляется доступ к использованию метода hook у MODULE.
Для простоты понимания, воспринимаем MODULE.hook('routes') как emit('routes').
Как говорилось ранее, с помощью MODULE.hook('routes') получим массив роутов, который описан в плагине. Если мы не создадим плагин, то события routes у нас не будет и MODULE.hook('routes') нам ничего не вернет.
Для вывода в сайдбаре страницы и переключения по роутам в плагине было добавлено событие menuItems, которое вернет нам массив элементов меню с нужными путями.

Наш модуль реагирует на событие menuItems и возвращает массив, описанный в плагине:

```js
  const menuItems = useMemo(() => [
    { name: 'Home', to: adminPath, icon: faTachometerAlt },
    ...MODULE.hook('menuItems').flat().map(item => ({
      ...item,
      to: item.to ? (adminPath + '/' + item.to) : undefined
    }))
  ], [adminPath])
```

По такому принципу мы можем добавлять любое количество плагинов и реагировать на них внутри модуля через MODULE.hook.