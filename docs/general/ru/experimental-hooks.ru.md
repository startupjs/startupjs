# Экспериментальные хуки

## Хуки: server

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
    expressApp.use('/assets', expressApp.static('assets'))
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