# Hooks

## Клиентские хуки

### `renderRoot`

Этот хук используется для определения корневого компонента, в который будут отрисовываться все дочерние компоненты приложения. Хук renderRoot позволяет поменять стандартное поведение рендеринга и его структуру.

Если у вас есть несколько плагинов, каждый из которых вызывает renderRoot, то каждый следующий плагин будет получать в children то,
что вернется после работы  предыдущего плагина. Таким образом обеспечивается "вложенность".

Разберем подробнее этот хук на примере. Допустим, у нас есть два плагина. Первый плагин добавит в наше приложение красную полосу с текстом Red block. Он имеет такой вид:

```js
export default createPlugin({
  name: 'redPlugin',
  client: () => ({
    renderRoot ({ children }) {
      return <>
        <RedBlock />
        {children}
      </>
    }
  })
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

Далее мы подключим второй плагин:

```js
export default createPlugin({
  name: 'greenPlugin',
  client: () => ({
    renderRoot ({ children }) {
      return <>
        <GreenBlock />
        {children}
      </>
    }
  })
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

Он добавит зеленую полосу с текстом Green block. При этом на экране мы по-прежнему будем видеть и красную полосу тоже.


### `customFormInputs`

С помощью хука 'customFormInputs' вы можете добавить новые типы компонента Input, который, в свою очередь, является частью логики компонента Form.

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

## Серверные хуки

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

Хук 'beforeSession' вызывается перед инициализацией сессии на сервере. Он предоставляет возможность выполнить любые операции или установить конфигурации перед тем, как сервер начнет обрабатывать запросы. Сессии на сервере реализованы с помощью пакета express-session, подробнее о возможностях которого можно прочитать на [официальной странице](https://github.com/expressjs/session#readme).

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

Хук 'afterSession' вызывается после инициализации сессии на сервере.

```js
  afterSession: (expressApp) => {
    // Пример добавления middleware после инициализации сессии
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
      const lang = req.session.lang
      if (lang) req.model.set('_session.lang', lang)
      next()
    })
  }
```

### `serverRoutes`

Хук 'serverRoutes' используется для добавления серверных эндоинтов, которые могут использоваться как для рендера html, так и для реализации вебхуков и тому подобного.

```js
  serverRoutes: (expressApp) => {
    // Создание маршрута для обработки GET-запросов
    expressApp.get('/promo-page', (req, res) => {
      // Отправляем HTML как ответ на запрос
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


## Изоморфные хуки

В изоморфных хуках вы можете размещать код, который будет выполняться как на сервере, так и на клиенте.

### `models`

Хук 'models' получает модели (projectModels), которые были добавлены в проект. С помощью этого хука можно модифицировать модели или добавлять новые.

Здесь мы покажем, как в целом добавляется хук, а более детальные примеры использования можно посмотреть [здесь](https://github.com/startupjs/startupjs/blob/master/docs/general/ru/models.ru.md)

```js
  export default createPlugins({
    name: 'addPersonModel',
    // Не забываем, что models - это изоморфный хук
    isomorphic: () => ({
      // Хук получает модели проекта (projectModels)
      models: (projectModels) => {
        return {
          ...projectModels,
          // ниже для каждой коллекции или документа необходимо указать объект с теми же полями,
          // которые обычно экспортируются из файла модели.
          // Добавим модель коллекции persons
          persons: {
            // в default указывается ORM класс с реализацией кастомных методов для этой модели коллекции
            default: PersonsModel,
            // для схемы передаем schema
            schema
            // ... другие данные, например, индексы или константы,
            // которые были экспортированы из файла модели
          }
        }
      }
    })
  })
```

### `orm`

Хук 'orm' - это advanced хук для перегрузки Racer, который используется под капотом для реализации ORM. В частности, его можно использовать, если необходимо подключить плагины для racer (через racer.use()) или расширить стандартный функционал racer. В этот хук аргументом приходит инстанс Racer.

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


## Пример создания плагина

Предположим, у нас есть кнопка в клиентском коде, при нажатии на которую приложение должно получить данные с сервера.
Весь код файла на клиенте будет таким:

```js
import { useState } from 'react'
import { observer } from 'startupjs'
import { Div, Button, Span } from '@startupjs/ui'
import axios from 'axios'

export default observer(function SomeScreen () {
  const [data, setData] = useState()

  async function fetchData () {
    try {
      const response = await axios.get('/api/get-data')
      setData(response.data)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Div>
      <Button onPress={fetchData}>Fetch by plugin</Button>
      {data && data.message && <Span>Text: {data.message}</Span>}
    </Div>
  )
})
```

Создадим файл плагина с именем test.plugin.js.
В этом примере мы будем использовать хук "api", который будет возвращать некоторые данные с сервера.

```js
import { createPlugin } from '@startupjs/registry'

export default createPlugin({
  name: 'test',
  enabled: true,
  // среда выполнения - server
  // получаем pluginOptions, в который мы передали appName (ниже описано)
  server: (pluginOptions) => ({
    // используем хук api
    api: (expressApp) => {
      // при get запросе на '/api/get-data'
      // возвращаем свой текст, к которому добавляем пользовательский appName из pluginOptions
      expressApp.get('/api/get-data', async (req, res) => {
        res.json({ message: `Текст, возвращаемый плагином ${pluginOptions.appName}` })
      })
    }
  })
})
```

Добавим информацию о плагине в startupjs.config.js и передадим в него нужные параметры (они будут лежать в pluginOptions)

```js
  import testPlugin from './test.plugin.js'

  export default {
    plugins: {
      [testPlugin]: {
        // передадим для хуков пользовательские pluginOptions
        server: {
          // пусть это будет какое-то название приложения, которое будет лежать в appName
          // мы получим эти данные в самом плагине и сможем их использовать на свое усмотрение
          appName: 'TEST APP'
        }
      }
    }
  }
```

Добавим этот файл в "exports" в package.json, чтобы он автоматически загружался в ваше приложение:

```json
  "exports": {
    "./test.plugin": "./test.plugin.js"
  }
```

## Читайте дальше:
- [Что такое модули и как с ними работать](https://github.com/startupjs/startupjs/blob/master/docs/general/ru/about-modules.ru.md)
