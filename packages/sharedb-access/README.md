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
database operation for every collection. You can use two types of rules: 
`allow` and `deny`. By default all the operations are denied. So, you should
add some rules to allow them. If at least one `allow`-rule allows the write, and
no `deny`-rules deny the write, then the write is allowed to proceed. 

You can call `allow` and `deny`-rules as many times as you like. The functions 
should return `true` if they think the operation should be allowed for `allow` 
rules and denied for `deny`-rules. Otherwise they should return `false`, or 
nothing at all (`undefined`).

#### Create
You can describe access rules in the model. Create `static accessControl` object in your orm model. Template of `accessControl`:

```js
static accessControl = {
  Allow: {
    all: bool, // it will provide access for all operations
    Create: [asyncFunc1, asyncFunc2, asyncFunc3...],
    Read: [asyncFunc1, asyncFunc2, asyncFunc3...],
    Update: [asyncFunc1, asyncFunc2, asyncFunc3...],
    Delete: [asyncFunc1, asyncFunc2, asyncFunc3...]
  }
  Deny: {
    Create: [asyncFunc1, asyncFunc2, asyncFunc3...],
    Read: [asyncFunc1, asyncFunc2, asyncFunc3...],
    Update: [asyncFunc1, asyncFunc2, asyncFunc3...],
    Delete: [asyncFunc1, asyncFunc2, asyncFunc3...]
  }
}
```
You can describe only those fields that are necessary.

#### Operations
```js
// Allow create-operation for collection 'items'

// docId - id of your doc for access-control
// doc   - document object
// session - your connect session
static accessControl = {
  Allow: {
    Create: [
      async (docId, doc, session) => {
        return true
      }
    ]
  },
  Deny: {
     Create: [
      async (docId, doc, session) => {
        return !session.isAdmin
      }
    ]
  }
}

// So, finally, only admins can create docs in 'items' collection
// the same results is if you just write:

static accessControl = {
  Allow: {
    Create: [
      async (docId, doc, session) => {
        return session.isAdmin
      }
    ]
  }
}
```
#### Read

Interface is like `create`-operation

```js
static accessControl = {
  Allow: {
    Read: [
      async (docId, doc, session) => {
        // Allow all operations
        return true
      }
    ]
  },
  Deny: {
     Read: [
      async (docId, doc, session) => {
        // But only if the reader is owner of the doc
        return doc.ownerId !== session.userId
      }
    ]
  }
}
```

#### Delete

Interface is like `create`-operation

```js
static accessControl = {
  Allow: {
    Delete: [
      async (docId, doc, session) => {
        // Only owners can delete docs
        return doc.ownerId === session.userId
      }
    ]
  },
  Deny: {
     Delete: [
      async (docId, doc, session) => {
        // But deny deletion if it's a special type of docs
        return doc.type === 'liveForever'
      }
    ]
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

static accessControl = {
  Allow: {
    Update: [
     allowUpdateAll
    ]
  }
}
```

#### Allow Create, Read, Update, Delete
```js
static accessControl = {
  Allow: {
    all: true
  }
}
```

## MIT License 2020
