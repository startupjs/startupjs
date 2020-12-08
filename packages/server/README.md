# startupjs dm-sharedb-server
> Express.js server with ShareDB, configs system, and react-router support for rendering client apps.

## Usage

```javascript
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

## @startupjs/sharedb-access connection

### Usage
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

Using `@startupjs/sharedb-access` you can control `create`, `read`, `update`, and `delete`
database operation for every collection. You can define `allow` rules for each CRUD operations
in your orm model. By default all the operations are denied.

The functions should return `true` if they think the operation should be allowed for
`allow` rules. Otherwise they should return `false`, or nothing at all (`undefined`).

#### Initialize
You can describe access rules in the model. Create `static access` object in your orm model.
Template of `access`:

```js
static access = {
  create: async (model, collection, docId, doc, session) => { your code }
  read: async (model, collection, docId, doc, session) => { your code },
  update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { your code },
  delete: async (model, collection, docId, doc, session) => { your code }
}
```
You can describe only those fields that are necessary. But keep in mind that without describing
the permission rule for the operation, it is considered prohibited by default.

#### Create
```js
// Allow create-operation for collection 'items'

// docId - id of your doc for access-control
// doc   - document object
// session - your connect session
class ItemModel {
  static access = {
    create: async (model, collection, docId, doc, session) => {
      return true
    }
  }
}

// For example, let only admins can create docs in 'items' collection
// access will be:

class ItemModel {
  static access = {
    create: async (model, collection, docId, doc, session) => {
      return  session.isAdmin
    }
  }
}
```
#### Read

Interface is like `create`-operation

```js
class ItemModel {
  static access = {
    // Only if the reader is owner of the doc
    read: async (model, collection, docId, doc, session) => {
      return doc.ownerId === session.userId
    }
  }
}
```

#### Delete

Interface is like `create`-operation

```js
class ItemModel {
  static access = {
    // Only owners can delete docs, but nobody can delete doc with special typ
    delete: async (model, collection, docId, doc, session) => {
      return doc.ownerId === session.userId && doc.type !== 'liveForever'
    }
  }
}
```

#### Update

```js
// docId - id of your doc for access-control
// oldDoc  - document object (before update)
// newDoc  - document object (after update)
// ops    - array of OT operations
// session - your connect session

const allowUpdateAll = async (model, collection, docId, oldDoc, session, ops, newDoc) => {
  return true
}

class ItemModel {
  static access = {
    update: allowUpdateAll
  }
}
```

#### Allow Create, Read, Update, Delete
```js
class ItemModel {
  static access = {
    create: async (model, collection, docId, doc, session) => {
      return true
    },
    read: async (model, collection, docId, doc, session) => {
      return true
    },
    update: async (model, collection, docId, oldDoc, session, ops, newDoc) => {
      return true
    },
    delete: async (model, collection, docId, doc, session) => {
      return true
    }
  }
}
```


## @startupjs/sharedb-schema connection

## Usage

1. In `server/index.js` add `validateSchema: true` to `startupjsServer()` options
2. Go to one of your ORM document entities (for example, `UserModel`, which targets `users.*`) and add a static method `schema`:

```js
import { BaseModel } from 'startupjs/orm'

export default class UserModel extends BaseModel {
  static schema = {
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
    },
  }
}

```


## @startupjs/sharedb-aggregate connection

### Usage
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
After connecting the library, all requests with the `$aggregate` parameter will be **blocked**. In order to execute a query with aggregation,
it must be declared in the `static aggregations` of model for which the aggregation will be performed. For example:

```js
import { BaseModel } from 'startupjs/orm'

export default class EventsModel extends BaseModel {
  static aggregations = {
    openEvents: async (params, shareRequest) => {
      return [
        {$match: {status: 'open'}}
      ]
    }

  }
}

```

Here we have created an aggregation for the `events` collection named `openEvents`. Here `params` an object with parameters specified when calling a query;
`shareRequest` is the standard sharedb request [context object](https://github.com/share/sharedb#middlewares).

## Using queries (on the client):

**Only** aggregations defined in the model can be called on the client. The call is made by name and has the following form:

```js
model.query('events', {
    $aggregationName: 'openEvents',
    $params: {
      // your params
    }
  })
```

Or yo can use hook `useQuery`:
```js
const [openEvents] = useQuery('events', {
    $aggregationName: 'openEvents',
    $params: {
      // your params
    }
  })
```

## how params works
If you call such a query:

```js
model.query('events', {
  $aggregationName: 'openEvents',
  $params: {
    title: 'Test Event'
  }
})
```

then `params` in `openEvents` will contain:

```js
{
  title: 'Test Event'
}
```

This way you can customize your aggregations in difinition. For example you can want to get parameters for `$match`:

```js
import { BaseModel } from 'startupjs/orm'

export default class EventsModel extends BaseModel {
  static aggregations = {
    matchByParams: async (params, shareRequest) => {
      return [
        {$match: params}
      ]
    }
  }
}
```

Now you need to send necessary parameter in `$params`:

```js
model.query('events', {
  $aggregationName: 'matchByParams',
  $params: {
    title: 'Custom Params Name',
    status: 'close'
  }
})
```

## IMPORTANT! Using With Permissions

You can use this component with permission library for checking user roles and permissions. For it you need to add object with field `customCheck` in `serverAggregate`. `customCheck` is a function for additional checking. You can read how it works in [server-aggregate documentation](https://github.com/startupjs/startupjs/tree/master/packages/server-aggregate). We have special function for it in permissions library.

```js
import { checkAggregationPermission } from '@dmapper/permissions/access'

startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes()
  ],
  accessControl: true,
  serverAggregate: {
    customCheck: checkAggregationPermission
  }
```

Now in our orm will be checked the permissions to perform the aggregation. See documentation on `@dmapper/permissions` library in `core` (private for dmapper) to find out how to allow users to perform aggregations.

## MIT Licence

Copyright (c) 2016 Pavel Zhukov
