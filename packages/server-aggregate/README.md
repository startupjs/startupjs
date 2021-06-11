# @startupjs/server-aggregate

Racer server aggregate plugin. It allows only server-defined aggregate queries.

## Install

```
yarn add @startupjs/server-aggregate
```

## Setup

In the client code:

```js
require('@startupjs/server-aggregate/client')
```

On the server:

```js
const serverAggregate = require('@startupjs/server-aggregate')
serverAggregate(backend, customCheck)
```

where:
* `backend`: your ShareDB backend instance
* `customCheck (optional)`: your personal check function. It should return an error message if there is an error. **IMPORTANT** The message must be of type `string`.

## How to add aggregation

On the server side to add aggregation use `backend.addAggregate(collection, queryName, cb)`, where:

* `collection`: collection name
* `queryName`: query name (alias)
* `cb(params, shareRequest)`: async function that returns a query object or throw an error

```js
backend.addAggregate('items', 'main', async (params, shareRequest) => {
  // ...
  // access control or whatever
  // ...

  return [
    {$match: {type: 'wooden'}}
  ]
})
```

## Usage

```js
model.query('items', {
  $aggregationName: 'main',
  $params: {
    type: 'global'
  }
})
```

When you setup the client side as described in the `Setup` section you can use the `aggregateQuery(collection, queryName, params)` function which is syntactic sugar over the `model.query`, where:

```js
model.aggregateQuery('items', 'main', { type: 'global' })
```

## MIT License

Copyright (c) 2018 by Artur Zayats
