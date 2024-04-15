# Мета-пакет StartupJS

Это мета-пакет `startupjs`, который объединяет все основные пакеты вместе
для более простого распространения в качестве единого пакета.

Для общего описания StartupJS см. README в корневом монорепо.

## Дополнительные зависимости

- `events` добавлен здесь как явная зависимость, так как он используется внутри `racer`.
  Который не указывает его в своих собственных зависимостях. Обычно в браузере он будет полифилирован
  webpack, но в нашем случае Metro не полифилит его самостоятельно, поэтому нам нужно иметь его
  присутствует в наших зависимостях где-то.


## Plugins API

Создайте файл плагина с именем plugin.js или myPlugin.plugin.js:

```js
import { createPlugin } from 'startupjs/registry'

export default createPlugin({
  // name - уникальное название плагина
  name: 'my-plugin',
  // order позволяет контролировать порядок выполнения плагинов.
  // Может быть как числовым, так и строковым значением. Необязательное свойство.
  order: 1
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
          // Список параметров для серверных хуков. Они будут доступны в pluginOptions.
          someOptionForServer: 'Hello from server'
        },
        // Здесь указываем все, что касается клиентских хуков
        client: {
          // Список параметров для клиентских хуков. Они будут доступны в pluginOptions.
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

### `orm`

Хук 'orm' используется для настройки объектно-реляционного отображения (ORM) в приложении Express.js.

**Примечание:** Не забудьте получить Racer в качестве аргумента. Он передается автоматически при вызове хука

```js
  orm: (Racer) => {
    const racer = new Racer();

    // Настройка ORM на сервере
    racer.on('ready', () => {
      console.log('Racer ORM is ready');
    });
    racer.on('error', (err) => {
      console.error('Error in Racer ORM:', err);
    });
    return racer;
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

    // Создание маршрута для обработки POST-запросов
    expressApp.post('/api/data', async (req, res) => {
      // Обработка POST-запроса и сохранение данных
      const requestData = req.body
      res.json({ message: 'Данные успешно получены и обработаны' })
    })
  }
```

### `beforeSession`

Хук 'beforeSession' вызывается перед началом сессии на сервере. Он предоставляет возможность выполнить любые операции или установить конфигурации перед тем, как сервер начнет обрабатывать запросы.

```jsx
  beforeSession: (expressApp) => {
  // Пример добавления middleware перед инициализацией сессии
  expressApp.use('/api/validate', (req, res, next) => {
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
    // Пример добавления middleware после инициализации сессии
    expressApp.use('/api/log', (req, res, next) => {
      // Пример логирования информации о запросе после инициализации сессии
      console.log(`Запрос к ${req.originalUrl} от ${req.ip}`)
      next()
    })
  }
```

### `middleware`

Хук 'middleware' определяет обработчик промежуточного ПО. Этот хук может использоваться для добавления общих операций или проверок.

```js
  middleware: (expressApp) => {
    // Пример добавления промежуточного ПО для логирования каждого запроса
    expressApp.use('/api', (req, res, next) => {
      console.log(`Received ${req.method} request at ${req.url}`)
      next()
    })
  }
```

### `serverRoutes`

Хук 'serverRoutes' используется для определения маршрутов на сервере, которые обрабатывают определенные типы HTTP-запросов, такие как GET и POST

```js
  serverRoutes: (expressApp) => {
    // Создание маршрута для обработки GET-запросов
    expressApp.get('/api/data', async (req, res) => {
      // Здесь может быть логика обработки запроса
      res.json({ message: 'Data received from the server' })
    })

    // Создание маршрута для обработки POST-запросов
    expressApp.post('/api/data', async (req, res) => {
      // Здесь может быть логика обработки запроса и сохранения данных
      const requestData = req.body
      res.json({ message: 'Data received and processed successfully' })
    })
  }
```

### `logs`

Хук 'logs' обрабатывает запросы на получение и сохранение логов.

```js
  logs: (expressApp) => {
    // Создание маршрута для логирования информации
    expressApp.get('/logs', async (req, res) => {
      // Здесь вы можете добавить логику для получения и отображения логов.
      res.send('Логи')
    })

    // Создание маршрута для сохранения информации
    expressApp.post('/logs', async (req, res) => {
      const logData = req.body
      // Здесь вы можете добавить логику для получения и сохранения информации
      console.log('Полученные данные:', logData)
      res.send('Данные успешно получены и сохранены')
    })
  }
```

### `static`

Этот хук позволяет получить доступ к статическим файлам (таким как изображения, CSS, JavaScript) на стороне клиента вашего приложения, делая их доступными через определенный URL-адрес.

```js
  static: (expressApp) => {
    expressApp.use('/public', express.static('public'))
  }
```

### `createServer`

Используйте этот хук, если вам нужно настроить и запустить сервер.

**Примечание:** Не забудьте получить server в качестве аргумента. Он передается автоматически при вызове хука

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

Этот хук предназначен для обработки апгрейда HTTP-соединения до WebSocket-соединения.

**Примечание:** Не забудьте получить arguments в качестве аргумента. Они передаются автоматически при вызове хука. Arguments включают в себя, в частности, req, socket, head. Больше информации о событии upgrade и содержимом arguments вы можете узнать из официальной документации по ссылке https://nodejs.org/api/http.html#event-upgrade

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

Используйте этот хук для выполнения кода перед запуском сервера Express.

**Примечание:** Не забудьте получить props в качестве аргумента. Они передаются автоматически при вызове хука. Пропсы включают в себя backend, server, expressApp, session

```js
  beforeStart: (props) => {
    // Например, настройка соединения с базой данных перед запуском сервера
    const db = require('./db')
    db.connect()
    console.log('Сервер готов к запуску...')
  }
```

### `transformSchema`

Используйте этот хук для изменения схемы.

**Примечание:** Не забудьте получить schema в качестве аргумента. Она передается автоматически при вызове хука

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
