## @startupjs/sharedb-access

### Installation

- Install npm: `npm install @startupjs/sharedb-access`
- Install yarn: `yarn add @startupjs/sharedb-access`


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
}
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
  create: async (docId, doc, session) => { your code }
  read: async (docId, doc, session) => { your code },
  update: async (docId, doc, session) => { your code },
  delete: async (docId, oldDoc, newDoc, ops, session) => { your code }
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
class ItemsModel {
  static access = {
    create: async (docId, doc, session) => {
      return true
    }
  }
}

// For example, let only admins can create docs in 'items' collection
// access will be:

class ItemsModel {
  static access = {
    create: async (docId, doc, session) => { 
      return  session.isAdmin
    }
  }
}
```
#### Read

Interface is like `create`-operation

```js
class ItemsModel {
  static access = {
    // Only if the reader is owner of the doc
    read: async (docId, doc, session) => {
      return doc.ownerId === session.userId
    }
  }
}
```

#### Delete

Interface is like `create`-operation

```js
class ItemsModel {
  static access = {
    // Only owners can delete docs, but nobody can delete doc with special typ
    delete: async (docId, doc, session) => { 
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

const allowUpdateAll = async (docId, oldDoc, newDoc, ops, session) => {
  return true
}

class ItemsModel {
  static access = {
    update: allowUpdateAll
  }
}
```

#### Allow Create, Read, Update, Delete
```js
class ItemsModel {
  static access = {
    create: async (docId, doc, session) => { 
      return true
    },
    read: async (docId, doc, session) => { 
      return true
    },
    update: async (docId, doc, session) => { 
      return true
    },
    delete: async (docId, oldDoc, newDoc, ops, session) => { 
      return true
    }
  }
}
```

## MIT License 2020
