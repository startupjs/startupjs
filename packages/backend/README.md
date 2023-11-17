# startupjs backend
> Create new ShareDB backend instance

## Installation

```sh
yarn add @startupjs/backend
```

## Requirements

```
nconf: *
```

## Usage

```js
import createBackend from '@startupjs/backend'

export default async function runServer () {
  const { backend, shareDbMongo, redisClient, redisPrefix, redis } = await createBackend(options)
  // ...
}
```

where `options` are:

- `pollDebounce` is the minimum delay between subsequent database polls . It is used individually for each collection in database. This is used to batch updates to reduce load on the database.

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
