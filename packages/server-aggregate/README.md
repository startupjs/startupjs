## @startupjs/server-aggregate

Racer server aggregate plugin. It allows only server-defined aggregate queries.

### install

```
yarn add @startupjs/server-aggregate
```

### usage

In our client code:

```js
require('@startupjs/server-aggregate/client')
```

On the server:
```js

const serverAggregate = require('@startupjs/server-aggregate')
serverAggregate(backend, customCheck)

Here:

- `backend` - your backend
- `customCheck` - your personal check function. It should return an error message if there is an error. **IMPORTANT** The message must be of type `string`.

// function addAggregate accept
// 'collection' - collection name
// 'queryName'  - name of query
// 'cb' - function that accepts 'params' and 'shareRequest'
// and returns a query-object or error-string

backend.addAggregate('items', 'main', async (params, shareRequest) => {
  // ...
  // access control or whatever
  // ...

  return [
    {$match: {type: 'wooden'}}
  ]
})


```

Using queries (on the client):

```js
  // function aggregateQuery accepts 3 arguments:
  // 'collection' - collection name (should match one from addServerQuery)
  // 'queryName' - name of query (should match one from addServerQuery)
  // 'params' - object with query-params

  const query = model.aggregateQuery('items', 'main', {
    type: 'global'
  })

  model.subscribe(query, function(){
    // ...
  })

```

Alternative approach (using regular model.query)

```js
  const query = model.query('items', {
    $aggregationName: 'main',
    $params: {
      type: 'global'
    }
  })

  model.subscribe(query, function(){
    // ...
  })

```

## MIT License
Copyright (c) 2018 by Artur Zayats

