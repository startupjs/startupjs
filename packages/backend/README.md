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
import getBackend from '@startupjs/backend'

export default async function runServer () {
  const backend = await getBackend(options)
  // ...
}
```

where `options` are:

- `pollDebounce` is the minimum delay between subsequent database polls . It is used individually for each collection in database. This is used to batch updates to reduce load on the database.

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
