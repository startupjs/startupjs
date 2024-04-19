# Мета-пакет StartupJS

Это мета-пакет `startupjs`, который объединяет все основные пакеты вместе
для более простого распространения в качестве единого пакета.

Для общего описания StartupJS см. README в корневом монорепо.

## Дополнительные зависимости

- `events` добавлен здесь как явная зависимость, так как он используется внутри `racer`,
  который не указывает его в своих собственных зависимостях. Обычно в браузере он будет заполифилен
  webpack, но в нашем случае Metro не полифилит его самостоятельно, поэтому нам нужно иметь его
  в наших зависимостях.


## Plugins API

Создайте файл плагина с именем plugin.js или myPlugin.plugin.js:

```js
import { createPlugin } from 'startupjs/registry'

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

Для того, чтобы передать параметры в плагин (pluginOptions в нашем примере), вам нужно указать их в файле startupjs.config.js.
Для этого сначала импортируем плагины, затем указываем параметры в следующем виде:

```js
  import myPlugin from './plugins/myPlugin.plugin.js'
  import somePlugin from './plugins/somePlugin.plugin.js'

  export default {
    plugins: {
      // Здесь myPlugin, somePlugin - названия ваших плагинов
      [myPlugin]: {
        // Здесь указываем все, что касается серверных хуков
        server: {
          // Список параметров для серверных хуков. Они будут храниться в pluginOptions и доступны в хуках.
          someOptionForServer: 'Hello from server'
        },
        // Здесь указываем все, что касается клиентских хуков
        client: {
          // Список параметров для клиентских хуков. Они будут храниться в pluginOptions и доступны в хуках.
          someOptionForClient: 'Hello from client'
        }
      },
      [somePlugin]: {
        // Eсли параметры для client не нужны, то можно просто не указывать этот блок. Аналогично с server и isomorphic
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

Возможные варианты групп:

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


## Hooks / client

### `renderRoot`

Этот хук используется для определения корневого компонента, в который будут отрисовываться все дочерние компоненты приложения.
Если у вас есть несколько плагинов, каждый из которых вызывает renderRoot, то каждый следующий плагин будет получать в children то,
что вернется после работы  предыдущего плагина. Таким образом обеспечивается "вложенность".

```js
  renderRoot ({ children }) {
    return <>
      <SomeComponent />
      {children}
    </>
  }
```

Разберем подробнее этот хук на примере. Допустим, у нас есть два плагина. Первый имеет такой вид:

```js
export default createPlugin({
  name: 'redPlugin',
  client: () => {
    return {
      renderRoot ({ children }) {
        return <>
            <RedBlock />
            {children}
          </>
      }
    }
  }
})

const RedBlock = observer(({ children }) => {
  return pug`
    Div.root(row)
      Span Red block
  `
  styl`
    .root
      background-color var(--color-bg-error)
      width: '100%'
  `
})
```

Он добавит в наше приложение красную полосу с текстом Red block. Если далее мы подключим второй плагин вида:

```js
export default createPlugin({
  name: 'greenPlugin',
  client: () => {
    return {
      renderRoot ({ children }) {
        return <>
            <GreenBlock />
            {children}
          </>
      }
    }
  }
})

const GreenBlock = observer(({ children }) => {
  return pug`
    Div.root(row)
      Span Green block
  `
  styl`
    .root
      background-color var(--color-bg-success)
      width: '100%'
  `
})
```

То будет добавлена зеленая полоса с текстом Green block. При этом на экране мы по-прежнему будем видеть и красную полосу тоже.

В файле package.json подключаем как обычно:

```json
  "exports": {
    "./plugins/redBlock.plugin": "./plugins/redBlock.plugin.js",
    "./plugins/greenPlugin.plugin": "./plugins/greenPlugin.plugin.js"
  }
```

### `customFormInputs`

С помощью хука 'customFormInputs' вы можете добавить новые типы инпутов в компонент Input, который, в свою очередь, является частью логики компонента Form.

Подробнее про Form можно почитать здесь:
https://github.com/startupjs/startupjs/blob/master/packages/ui/components/forms/Form/Form.ru.mdx


```js
  export default createPlugin({
    name: 'userCustomForm',
    client: ({ minAge }) => ({
      customFormInputs: () => ({
        age: observer(({ $value }) => {
          function setAge (age) {
            if (age < minAge) age = minAge
            $value.set(age)
          }
          return <NumberInput value={$value.get()} onChangeNumber={setAge} />
        })
      })
    })
  })
```


## Hooks / isomorphic

В изоморфных хуках вы можете размещать код, который будет выполняться как на сервере, так и на клиенте.

### `models`

Хук 'models' получает модели (projectModels), которые были добавлены в проект. С помощью этого хука можно модифицировать модели или добавлять новые.

Для примера создадим плагин, который будет добавлять новую модель

```js
  export default createPlugins({
    name: 'addPersonModel',
    // Не забываем, что models - это изоморфный хук
    isomorphic: () => ({
      // Хук получает модели проекта (projectModels)
      models: (projectModels) => {
        // Проверяем, есть такая модель или нет
        if (projectModels.person) throw Error('The model already exists')
        // Добавляем данные для новой модели и возвращаем новый объект
        const newModelsObject = {
          ...projectModels,
          // Добавляем новую модель person
          person: {
            default: {
              collection: 'person'
            },
            schema: {
              name: { type: 'string', required: true },
              age: { type: 'number' },
              gender: { type: 'string', enum: ['man', 'woman'] },
              phone: { type: 'string' },
              createdAt: { type: 'number', required: true }
            }
          }
        }
        return newModelsObject
      }
    })
  })
```

После чего экспортируем плагин в startupjs.config.js, как было сделано в примерах выше, и добавляем в exports в package.json

### `orm`

Хук 'orm' - это advanced хук для перегрузки 'racer', который используется под капотом для реализации ORM. В частности, его можно использовать, если необходимо подключить плагины для racer (через racer.use()) или расширить стандартный функционал racer. В этот хук аргументом приходит racer инстанс.

Подробнее про Racer можно ознакомиться в документации по ссылке https://github.com/derbyjs/racer

```js
// импортируем плагин
import racerPlugin from './myRacerPlugin.js';
```

```js
  orm: (racer) => {
    // Подключаем рейсеровский плагин
    racer.use(racerPlugin);
  }
```


## Hooks / server

### `api`

Хук 'api' определяет маршруты API для обработки запросов к серверу.

```js
  api: (expressApp) => {
    // Создание маршрута для обработки GET-запросов
    expressApp.get('/api/data', async (req, res) => {
      // Обработка GET-запроса
      res.json({ message: 'Данные получены с сервера' })
    })
  }
```

### `beforeSession`

Хук 'beforeSession' вызывается перед началом сессии на сервере. Он предоставляет возможность выполнить любые операции или установить конфигурации перед тем, как сервер начнет обрабатывать запросы.

```jsx
  beforeSession: (expressApp) => {
    // Пример добавления middleware перед инициализацией сессии
    expressApp.use('/api', (req, res, next) => {
      // Пример проверки сессии перед инициализацией
      if (!req.headers['authorization']) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      // Если все ок, продолжаем выполнение запроса
      next()
    })
  }
```

### `afterSession`

Хук 'afterSession' вызывается после завершения сессии на сервере.

```js
  afterSession: (expressApp) => {
    // Пример добавления middleware после завершения сессии
    expressApp.use('/api', (req, res, next) => {
      // Выводим информацию о запросе
      console.log(`Путь запроса: ${req.url}`);
      next()
    })
  }
```

### `middleware`

Хук 'middleware' определяет обработчик промежуточного ПО. Этот хук может использоваться для добавления общих операций или проверок.

```js
  middleware: (expressApp) => {
    // Пример добавления промежуточного ПО
    expressApp.use('/api', (req, res, next) => {
      const userId = req.session.userId;
      // Выводим ID пользователя
      console.log(`ID пользователя: ${userId}`);
      next()
    })
  }
```

### `serverRoutes`

Хук 'serverRoutes' используется для запросов типа .get(), когда необходимо вернуть с сервера отрендеренный HTML или статические HTML страницы, например, промо-страницу.

```js
  serverRoutes: (expressApp) => {
    // Создание маршрута для обработки GET-запросов
    expressApp.get('/promo-page', (req, res) => {
      // Отправляем отрендеренный HTML как ответ на запрос
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Promo Page</title>
          </head>
          <body>
            <!-- some code -->
          </body>
        </html>
      `)
    })
  }
```

### `logs`

Хук 'logs' обрабатывает запросы на получение и сохранение логов.

```js
  logs: (expressApp) => {
    expressApp.use('/api', (req, res, next) => {
      // Пример логирования информации о запросе
      console.log(`Запрос к ${req.originalUrl} от ${req.ip}`)
      next()
    })
  }
```

### `static`

Этот хук предназначен для объявления дополнительных статических файлов (таких как изображения, CSS, JavaScript) на стороне клиента вашего приложения, делая их доступными через определенный URL-адрес. При этом вы по-прежнему cможете обратиться к папке public, которая будет доступна по url '/'.

```js
  static: (expressApp) => {
    expressApp.use('/assets', express.static('assets'))
  }
```

### `createServer`

Используйте хук 'createServer', если вам нужно настроить и запустить сервер. В хук передается аргумент 'server', который представляет собой экземпляр Node HTTP Server. Подробнее можно почитать в официальной документации по ссылке
https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener

```js
  createServer: (server) => {
    // Настройка порта для прослушивания
    const PORT = process.env.PORT || 3000

    // Запуск сервера на указанном порту
    server.listen(PORT, () => {
      console.log(`Сервер запущен. Порт: ${PORT}`)
    })
  }
```

### `serverUpgrade`

Этот хук предназначен для обработки апгрейда HTTP-соединения до WebSocket-соединения. В этот хук аргументами (args) приходят
req, socket, head. Больше информации о событии upgrade вы можете узнать из официальной документации по ссылке https://nodejs.org/api/http.html#event-upgrade

```js
  serverUpgrade: (...args) => {
    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

    socket.pipe(socket);
  }
```

### `beforeStart`

Используйте хук 'beforeStart' для выполнения кода перед запуском сервера Express. В этот хук аргументами приходят props, которые включают в себя backend, server, expressApp, session.

```js
  beforeStart: (props) => {
    // Например, настройка соединения с базой данных перед запуском сервера
    const db = require('./db')
    db.connect()
    console.log('Сервер готов к запуску...')
  }
```

### `transformSchema`

Используйте хук 'transformSchema' для изменения схемы. В этот хук аргументом приходит schema.

```js
  transformSchema: (schema) => {
    // Изменение схемы, например, добавление новых полей или удаление существующих
    // В этом примере мы добавляем новое поле
    schema.properties.newField = { type: 'string' };
    // В этом примере мы удаляем поле
    delete schema.properties.unwantedField;
    return schema;
  }
```

## Пример создания плагина

Предположим, у вас есть кнопка в клиентском коде, при нажатии на которую приложение должно получать данные с сервера.

```js
import { useState } from 'react'
import { axios, observer } from 'startupjs'
import { Div, Button, Span } from '@startupjs/ui'

export default observer(function SomeScreen () {
  const [text, setText] = useState('')

  async function fetchData () {
    const response = await axios.get('/api/get-data')
    setText(response.data)
  }

  return (
    <Div>
      <Button pushed onPress={fetchData}>Fetch by plugin</Button>
      {text ? <Span>Text: {text}</Span> : undefined}
    </Div>
  )
})
```

Создайте файл плагина с именем plugin.js или myTestPlugin.plugin.js.
В этом примере мы будем использовать хук "api", который будет возвращать некоторые данные с сервера.

```js
import { createPlugin } from '@startupjs/registry'

export default createPlugin({
  name: 'test',
  enabled: true,
  // При необходимости вы можете получить pluginOptions, но они не требуются в нашем примере.
  // server: (pluginOptions) => ({
  server: () => ({
    api (expressApp) {
      expressApp.get('/api/get-data', async (req, res) => {
        res.json({ message: 'Текст, возвращаемый плагином' })
      })
    }
  })
})
```

Добавьте этот файл в "exports" в package.json под именем test.plugin (укажите свое название файла), чтобы он автоматически загружался в ваше приложение:

```json
  "exports": {
    "./plugins/test.plugin": "./plugins/test.plugin.js"
  }
```
