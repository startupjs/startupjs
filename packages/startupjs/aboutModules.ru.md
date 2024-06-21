# Модули в Startupjs

Мы уже знаем, что startupjs дает возможность кастомизировать приложение с помощью плагинов. И в большинстве случаев этого будет достаточно. Но что делать, если наш плагин содержит в себе такой функционал, который тоже хотелось бы кастомизировать? Например, мы написали плагин для пакета Auth. При этом сам Auth дает возможность подключать разные стратегии авторизации (например, google, linkedIn и другие). В такой ситуации, мы можем создать модуль auth, в котором уже будут подключаться свои плагины, каждый из которых будет реализовывать свою стратегию. Для каждого модуля мы можем создать несколько плагинов. Пользователю достаточно будет установить пакет из startupjs, например, startupjs/auth-google (название дано для примера), и этот пакет будет автоматически подключен. Не надо будет ничего дополнительно настраивать.

Вся концепция модулей (как и плагинов) - это по сути концепция event-эмиттеров, где модуль - это наш eventEmitter, который имитит события, где вместо привычного нам emit выступает hook, а плагины - это функция on для подписки на события.
Единственное отличие от обычного eventEmitter это то, что наш eventEmitter возвращает данные.

## Давайте разберемся, как написать свой модуль на примере модуля admin?

Cтруктура нашего модуля выглядит так:

Админка состоит из сайдбара и контентной части. Это общая структура для проектов. А вот страницы, которые будут доступны в админке, индивидуальны для каждого проекта и их добавление и кастомизация будут реализованы через плагин 'admin-schema', который добавит в наш модуль admin несколько страниц и ендпоинтов API.

```
    admin/
    │
    ├── client/
    │ ├── _layout.js
    │ ├── index.js
    │ └── routes.js
    │
    ├── index.js
    ├── module.js
    └── package.json
```

Изначально мы должны создать модуль. Для этого в файле `module.js`, который лежит в корне прокта, напишим такой код:

```js
  import { createModule } from 'startupjs/registry'

  export default createModule({
    // name - уникальное название модуля
    name: 'admin'
  })
```

Добавьте информацию об этом файле в раздел `exports` файла `package.json` под именем `module.js` или `myModule.module.js`, чтобы он автоматически загружался в ваше приложение. Если модуль лежит в отдельной папке, то необходимо учесть путь:

```json
  "exports": {
    "./module.js": "./module.js",
    "./modules/myModule.module.js": "./modules/myModule.module.js"
  }
```

Модули и плагины тесно связаны друг с другом. Как мы знаем, плагины позволяют модифицировать какие-то части модуля, но и модуль в свою очередь должен содержать в себе крючки, за которые пользователь может дергать, написав свои собственные плагины.

Рассмотрим один из таких "крючков" на примере файла `routes.js`

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
Для взаимодействия с плагинами мы импортируем MODULE из файла, где мы его создали, и у нас появляется доступ к использованию метода hook у MODULE.

`import MODULE from '../module'`,

Для простоты понимания воспринимаем MODULE.hook('routes') как emit('routes').
Как говорилось ранее, с помощью MODULE.hook('routes') получим массив роутов, который описан в плагине. Если мы не создадим плагин, то события routes у нас не будет и MODULE.hook('routes') нам ничего не вернет.

Создадим плагин 'schema':

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

В этом примере роуты написаны таким образом, чтобы при добавлении плагина schema у нас появилось событие `routes` и при его вызове нам возвращался массив с дополнительными страницами, относящимися к admin-schema. Вся логика этих страниц описана в плагине.

Для того, чтоб "привязать" плагин к нужному модулю, используется свойство for у плагина. Об этом подробнее рассказано в документации о плагинах. Но если в двух словах, то вы просто указываете для for название модуля. Если for не указан, то модулем будет выступать сам startupjs, как корневой модуль.

Теперь, когда у нас есть роуты нужных нам страниц, нужно вывести их в сайдбаре. Для этого у нас есть другое событие - `menuItems`.
Мы так же реагируем на него в модуле admin.

В файле `_layout.js`, там где мы выводим menuItems добавим такой код:

```js
  const menuItems = useMemo(() => [
    { name: 'Home', to: adminPath, icon: faTachometerAlt },
    ...MODULE.hook('menuItems').flat().map(item => ({
      ...item,
      to: item.to ? (adminPath + '/' + item.to) : undefined
    }))
  ], [adminPath])
```

Из этого примера видно, что у нас всегда будет страница Home, но если мы подключим плагин schema, при обращении к событию menuItems, MODULE.hook('menuItems') вернет нам массив страниц с путями, описанными в плагине.

Так же, если нам потребуется расширить API базового модуля statrupjs мы можем не указывать for.
Новые страницы, которые мы добавили в примере выше, внутри себя используют вызовы API, но которые не зарегистрированы в startupjs. Для этого просто создадим плагин без for, где с помощью серверного хуки api расширим базовый модуль startupjs.

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

Так же мы можем написать плагин, который выводит какой-либо jsx:

```js
  export default createPlugin({
    name: 'schema',
    for: 'admin',
    enabled: true,
    client: () => ({
      renderTopbarRight: () => (
        <Avatar size='s'>Admin User</Avatar>
        )
    })
  })
```

И отобразить его мы можем прям в jsx модуля admin, используя клиентский хук `MODULE.RenderHook(name='renderTopbarRight')`, указывая для `name`, название события в клиентском плагине.

```js
return pug`
    SmartSidebar.sidebar($open=$sidebarOpened defaultOpen renderContent=renderSidebar)
    Div.topbar(row vAlign='center')
        Div.left(row gap vAlign='center')
        Button(
            variant='text'
            color='text-description'
            icon=faBars
            onPress=() => $sidebarOpened.set(!$sidebarOpened.get())
        )
        H1.title Admin
        Div.right(row gap vAlign='center')
        MODULE.RenderHook(name='renderTopbarRight')
    Slot
    `
```

## Итог
    - Создание модуля происходит с помощь функции createModule.
    - Модуль пишется с учетом будущих модификаций с помощью плагинов.
    - Взаимодействие с плагинами происходит через MODULE.hook(<event_name>)
    - Выводить готовый jsx с помощью клиентского хука `MODULE.RenderHook(name=<event_name>)
    - Исходя из этого руководства вы научились создавать свои модули и плагины для них.
    - Самое главное, что нужно знать разработчку, это то, что плагины не существуют отдельно от модулей, они всегда пишутся либо для базового модуля startupjs без явного указания for, либо для новых модулей, как в нашем примере.
