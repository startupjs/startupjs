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
  create: async (backend, collection, docId, doc, session) => { your code }
  read: async (backend, collection, docId, doc, session) => { your code },
  update: async (backend, collection, docId, oldDoc, session, ops, newDoc) => { your code },
  delete: async (backend, collection, docId, doc, session) => { your code }
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
    create: async (backend, collection, docId, doc, session) => {
      return true
    }
  }
}

// For example, let only admins can create docs in 'items' collection
// access will be:

class ItemModel {
  static access = {
    create: async (backend, collection, docId, doc, session) => { 
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
    read: async (backend, collection, docId, doc, session) => {
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
    delete: async (backend, collection, docId, doc, session) => { 
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

const allowUpdateAll = async (backend, collection, docId, oldDoc, session, ops, newDoc) => {
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
    create: async (backend, collection, docId, doc, session) => { 
      return true
    },
    read: async (backend, collection, docId, doc, session) => { 
      return true
    },
    update: async (backend, collection, docId, oldDoc, session, ops, newDoc) => { 
      return true
    },
    delete: async (backend, collection, docId, doc, session) => { 
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

## MIT Licence

Copyright (c) 2016 Pavel Zhukov
