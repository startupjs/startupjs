# startupjs/server

> Express.js server with ShareDB integration and ORM

## Usage

If you followed the startupjs project creation instructions and you are in a startupjs project then you don't need to write any code to start the server.

It's either embedded into Metro dev server for development, or for production it's embedded into `yarn start-production` command itself.

### IMPORTANT: How to run startupjs server-side code

When you run the server side part of startupjs manually through your own cli command, you have to import a startupjs Node.js loader for required preprocessing. Without it startupjs would not function correctly.

You can do it by either passing the `--import` option to node:

```sh
NODE_ENV=production node --experimental-detect-module --import=startupjs/nodeRegister ./server/index.js
```

Another way to import the loader is in the code itself. But in this case all subsequent imports in the same file must be async `import()` calls:

```js
import 'startupjs/nodeRegister'

const { default: startServer } = await import('startupjs/server')

await startServer()
```

### Start production server

If you want to start the production server, you can do it the following way:

```js
import startServer from 'startupjs/server'

const { server, backend, session, channel, expressApp } = await startServer()

console.log('started')
```

### Get server without starting it

```js
import { createServer } from 'startupjs/server'

const { server, backend, session, channel, expressApp } = await createServer()

// if you want to start it:
server.listen(() => console.log('started'))
```

### Get server as a connect middleware which you can embed into another existing server

```js
import { createMiddleware } from 'startupjs/server'

const { middleware, backend, session, channel } = await createMiddleware()

// do something with the middleware
```

### Get just the ORM part (with ShareDB connected to the DB)

This is useful for `cron` or `worker` microservices where you just want to work with the database and don't need any http server running.

```js
import { createBackend } from 'startupjs/server'

const backend = createBackend()

function doSomething () {
  const model = backend.createModel()
  // do things with model and then close it (IMPORTANT!) to prevent memory leaks
  model.close()
}

doSomething()
```

## Security: Access Control

This allows you to control `create`, `read`, `update`, and `delete` database operation for every collection in ORM model by
exporting `access` from your model files.

By default all operations are denied.

If you want to allow operation, return `true` from the access checking function:

```js
// only owner of the document can update it
update: ({ doc, session }) => doc.userId === session.userId
```

If you want to allow an operation for everyone, you can just set `true` for it:

```js
// anyone can read the document
read: true
```

### Usage

1. Set `accessControl: true` in `startupjs.config.js -> features`:

    ```js
    // startupjs.config.js
    export default {
      features: {
        enableServer: true,
        accessControl: true
      }
    }
    ```

2. Call `accessControl` function from `startupjs` and export result as `access` from the model file for a collection.

    **Important:** You can only add access control to collection files, NOT document files. For example `games.js`, but not `games.[id].js`.

    ```js
    // in model/users.js file
    import { accessControl } from 'startupjs'
    export const access = accessControl({
      // only admins can create a new user
      create: async ({ newDoc, docId, session, collection, type }) => session.isAdmin,
      // everyone can read other users info (it's public)
      read: async ({ doc, docId, session, collection, type }) => true,
      // only user itself can update their data. Except of the admin who can update anyone's data.
      update: async ({ doc, newDoc, docId, session, ops, collection, type }) => {
        return session.userId === docId || session.isAdmin
      },
      // only admins can delete users
      delete: async ({ doc, docId, session, collection, type }) => session.isAdmin
    })
    ```

## Security: Validate documents using JSON Schema

This allows you to force your MongoDB collections to always follow a specific json-schema definition.

If someone tries to write into an invalid field, that operation is going to be automatically denied and rolled back on the client.

This is especially useful during the development process to clearly define the shape of your data as well as reuse it to draw forms in the UI.

In the client code the same exact schema can be passed to `<Form fields={schema} />` component to render the form and automatically validate it (refer to `Form` documentation from `@startupjs/ui` for the full information on this with examples).

### Usage

1. Set `validateSchema: true` in `startupjs.config.js -> features`.

2. Export json schema as `schema` from the model file for a collection.

    **Important:** You can only add schema to collection files, NOT document files. For example `games.js`, but not `games.[id].js`.

    ```js
    // in model/users.js file
    import { belongsTo, hasOne, GUID_PATTERN } from 'startupjs'
    export const schema = {
      orgId: {
        ...belongsTo('orgs'),
        required: true
      },
      name: { type: 'string', required: true },
      gender: { type: 'string', enum: ['man', 'woman', 'other'], required: true },
      phone: {
        type: 'string',
        pattern: '^\\+\\d+$',
        minLength: 10,
        placeholder: '+10991234567'
      },
      instagram: { type: 'string' },
      photoFileId: {
        ...hasOne('files'),
        input: 'file',
        label: 'Photo',
        mimeTypes: 'image/*'
      },
      friends: {
        type: 'object',
        input: 'friends',
        additionalProperties: false,
        $comment: '`true` flags for everyone this person added as a friend',
        patternProperties: {
          [GUID_PATTERN]: { type: 'boolean' }
        }
      },
      token: { type: 'string', required: true, disabled: true },
      createdAt: { type: 'number', required: true }
    }
    ```

## Security: Restrict execution of MongoDB aggregation queries only to the server-side

Enable `serverAggregate: true` in `features` of `startupjs.config.js`

Then define your aggregations explicitly in your model files in the `model/` folder.

**Important:** You can only add aggregations in collection files, NOT document files. For example `games.js`, but not `games.[id].js`.

### `aggregation(getAggregationFn)`

Define an aggregation using this function and export it as a named export const from your model file.

#### `getAggregationFn: async (params, context) => object`

**`params`**

query params passed into

```js
useSub($$aggregation, params)
```

or as a parametrized query:

```js
model.query($$aggregation.collection, {
  $aggregationName: $$aggregation.name,
  $params: params
})
```

**`context`**

```js
{
  session, // current user's server-side session (usually would have things things like `session.userId`, `session.loggedIn`, etc.)
  collection // name of the collection (useful for cases when you want to reuse the same aggregation function across multiple collections in different model files)
}
```

**returns:**

If access is allowed for the current user, it must return either an object `{ $aggregate: [] }` or just the aggregation pipeline array directly `[]`

If anything else is returned it's treated as access denied. So basically to deny access to query you can just do an early return. If you return a string it will be be used as the access denied error message.

### `useSub($$aggregation, params)`

`useSub` can accept the aggregation itself with params for it.

### Example

`model/games.js`:

```js
import { aggregation, BaseModel, accessControl } from 'startupjs'
import { getAppName, getRoleId, DEFAULT_USER_ID } from 'server-lib'

const appName = getAppName()
const adminRoleId = getRoleId('admin')

export const access = accessControl({
  create: (doc, { session }) => session.roleId === adminRoleId,
  read: () => true,
  update: (doc, { session }) => session.roleId === adminRoleId || !doc.readonly,
  delete: (doc, { session }) => session.roleId === adminRoleId
})

export const $$createdByUser = aggregation((
  { userId = DEFAULT_USER_ID },
  { session }
) => ({
  // only admins can run this query
  if (!session.isAdmin) return
  return [{
    $match: {
      userId,
      $sort: { createdAt: -1 },
      appName
    }
  }]
}))

export default class GamesModel extends BaseModel {
  async addNew () {
    await this.add({ name: 'New Game' })
  }
}
```

`App.js`:

```jsx
import { $$createdByUser } from '@/model/games'
import { observer, useSub, $ } from 'startupjs'
import { Span } from '@startupjs/ui'

export default observer(() => {
  const userId = $.session.userId.get()
  const $games = useSub($$createdByUser, { userId })
  return $games.map($game => <Span key={$game.id.get()}>{$game.name.get()}</Span>)
})
```

## MIT License

Copyright (c) 2016 Pavel Zhukov
