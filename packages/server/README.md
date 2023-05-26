# startupjs dm-sharedb-server

> Express.js server with ShareDB, configs system, and react-router support for rendering client apps.

## Requirements

```
express: 4.x
nconf: *
```

## Usage

```js
import startupjsServer from '@startupjs/server'

startupjsServer({ getHead }, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', async (req, res) => {
      let { model } = req
      let $counter = model.at('counters.first')
      await $counter.subscribe()
      res.json({ name: 'Test API', counter: $counter.get() })
    })
  })
})

const getHead = appName => `
  <title>HelloWorld</title>
  <!-- Put vendor JS and CSS here -->
`
```

## `@startupjs/sharedb-access` connection

Add `accessControl: true` in options of your `startupjsServer`. For example:

```js
// server/index.js
startupjsServer(
{
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ],
  accessControl: true
}, ee => {
  ee.on('routes', expressApp => {
    expressApp.get('/api', async (req, res) => {
      let { model } = req
      let $counter = model.at('counters.first')
      await $counter.subscribe()
      res.json({ name: 'Test API', counter: $counter.get() })
    })
  })
})
```

Using `@startupjs/sharedb-access` you can control `create`, `read`, `update`, and `delete` database operation for every collection. You can define rules for each CRUD operations in your orm model. By default all operations are denied.

The function for operation should return `true` if operation should be allowed.

```js
static access = {
  create: async (model, collection, docId, doc, session) => { your code },
  read: async (model, collection, docId, doc, session) => { your code },
  update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { your code },
  delete: async (model, collection, docId, doc, session) => { your code }
}
```

## `@startupjs/sharedb-schema` connection

Add `validateSchema: true` in options of your `startupjsServer`. For example:

```js
// server/index.js
startupjsServer(
{
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ],
  validateSchema: true
}, ee => {
  // your code
})
```

Then add the static field `schema` to ORM for all collections you use. For example:

```js
import { BaseModel } from 'startupjs/orm'

export default class UserModel extends BaseModel {
  static schema = {
    type: 'object',
    properties: {
      nickname: {
        type: 'string',
        minLength: 1,
        maxLength: 10,
      },
      email: {
        type: 'string',
        format: 'email',
      },
      age: {
        description: 'Age in years',
        type: 'integer',
        minimum: 0,
      },
      roleId: {
        type: 'string'
      },
      hobbies: {
        type: 'array',
        maxItems: 3,
        items: {
          type: 'string',
        },
        uniqueItems: true,
      }
    }
  }
}
```

## `@startupjs/server-aggregate` connection

Add `serverAggregate: true` in options of your `startupjsServer`. For example:

```js
// server/index.js
startupjsServer(
{
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ],
  serverAggregate: true
}, ee => {
  // your code
})
```

After connecting the library, all requests with the `$aggregate` parameter will be **blocked**. In order to execute a query with aggregation, it must be declared in the `static aggregations` of model for which the aggregation will be performed. For example:

```js
import { BaseModel } from 'startupjs/orm'

export default class EventsModel extends BaseModel {
  static aggregations = {
    openEvents: async (model, params, session) => {
      return [
        {
          $match: {
            status: 'open', ...params
          }
        }
      ]
    }
  }
}
```

Here we have created an aggregation for the `events` collection named `openEvents`, where:
* `params`: an object with parameters specified when calling a query
* `shareRequest`: is the [sharedb](https://share.github.io/sharedb/) request

Then to use this created aggregation you need to pass to `$aggregationName` field of the query `openEvents` query name.

```js
model.query('events', {
  $aggregationName: 'openEvents',
  $params: {
    // your params
  }
})
```

## MIT Licence

Copyright (c) 2016 Pavel Zhukov

