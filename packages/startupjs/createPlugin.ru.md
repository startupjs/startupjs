# Как создать свой плагин

- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)

Создайте файл плагина с именем plugin.js или myPlugin.plugin.js (вместо myPlugin вы можете указать любое другое название файла, но обязательно должна присутствовать вторая часть названия файла ".plugin.js"). В примере ниже мы показали, что в себе содержит плагин. Ознакомьтесь с коммментариями в коде.

```js
import { createPlugin } from 'startupjs/registry'

// плагин создается с помощью функции createPlugin
export default createPlugin({
  // name - уникальное название плагина
  name: 'my-plugin',
  // enabled указывает, включен плагин или нет.
  // Если его значение false, то плагин считается отключенным и его
  // функциональность не будет активирована в приложении.
  enabled: true,
  client: (pluginOptions) => ({
    // Здесь может быть добавлена реализация клиентских хуков
  }),
  isomorphic: (pluginOptions) => ({
    // Здесь может быть добавлена реализация изоморфных хуков
  }),
  server: (pluginOptions) => ({
    // Здесь может быть добавлена реализация серверных хуков. Например,
    beforeSession: (expressApp) => {
      expressApp.use('/your-uniq-path', yourFunction)
    },
    api: (expressApp) => {
      expressApp.get('/api/your-uniq-path', async (req, res) => {})
      expressApp.post('/api/your-uniq-path', async (req, res) => {})
    }
  })
})
```

Добавьте информацию об этом файле в раздел `exports` файла `package.json` под именем `plugin` или `myPlugin.plugin`, чтобы он автоматически загружался в ваше приложение. Если плагины лежат в отдельной папке, то необходимо учесть путь:


```json
"exports": {
  "./plugin": "./plugin.js",
  "./plugins/myPlugin.plugin.js": "./plugins/myPlugin.plugin.js"
}
```

Для того, чтобы передать параметры в плагин (pluginOptions в нашем примере), вам нужно указать их в файле startupjs.config.js. Для этого сначала импортируем плагины в этот файл, затем указываем параметры в следующем виде:

```js
  import myPlugin from './plugins/myPlugin.plugin.js'
  import somePlugin from './plugins/somePlugin.plugin.js'

  export default {
    plugins: {
      // Здесь myPlugin, somePlugin - названия плагинов, под которыми вы их импортировали
      [myPlugin]: {
        // Здесь указываем все, что касается серверных хуков
        server: {
          // Список параметров для серверных хуков. Они будут храниться в pluginOptions и доступны в хуках.
          someServerOption: 'server'
        },
        // Здесь указываем все, что касается клиентских хуков
        client: {
          // Список параметров для клиентских хуков. Они будут храниться в pluginOptions и доступны в хуках.
          someClientOption: 'client'
        },
        // Здесь указываем все, что касается изоморфных хуков
        isomorphic: {
          // Список параметров для изоморфных хуков. Они будут храниться в pluginOptions и доступны в хуках.
          someIsomorphicOption: 'isomorphic'
        }
      },
      [somePlugin]: {
        // Eсли параметры для client не нужны, то можно просто не указывать этот блок. Аналогично с server и isomorphic
        // Для этого плагина, например, мы нужно передать опции только для серверных хуков.
        server: {
          someOption: 'Hello from server!'
        }
      },
      // Здесь вы можете добавить свой плагин со списком необходимых параметров.
    }
  }
```

### Order (опционально)

Опционально в createPlugin Вы можете добавить order - порядок исполнения хуков в плагине, указав "группу" исполнения.
Помимо указанных ниже "групп", вы так же можете использовать варианты 'before группа' и 'after группа'.

Возможные варианты групп в порядке их исполнения:

```js
export default [
  'first',
  'root',
  'session',
  'auth',
  'api',
  'pure', // для чистых плагинов startupjs, которые не зависят от наличия 'ui' или 'router'
  'ui', //  для плагинов, которые зависят от 'ui'
  'router', // для плагинов, которые зависят от 'router'
  'default', // группа по умолчанию, которая выполняется после всех остальных
  'last'
]
```

Например,

```js
export default createPlugin({
  name: 'my-plugin',
  enabled: true,
  order: 'ui',
  client: (pluginOptions) => ({
    // ...
  })
})
```

## Узнайте больше о системе плагинов:
- [Что такое плагины и зачем они нужны](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/aboutPlugins.ru.md)
- [Хуки для плагинов](https://github.com/startupjs/startupjs/blob/master/packages/startupjs/README.ru.md)
