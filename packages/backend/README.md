# StartupJS Backend
> Create a new ShareDB backend instance

## Installation

```sh
yarn add @startupjs/backend
```

## Requirements

```
nconf: *
```

## Configuration

The package can be configured using the following environment variables:

- `MONGO_URL`: Specifies the URL for the MongoDB connection. MongoDB is used as the primary database unless overridden by setting `NO_MONGO` to `true`.
- `NO_MONGO`: When set to `true`, this variable disables the use of MongoDB. In this case, the package will utilize a Mingo database, persisting data to SQLite.
- `DB_PATH`: Defines the file path for the SQLite database. This setting is relevant when `NO_MONGO` is `true`. If `DB_PATH` is not specified, the default file 'sqlite.db' will be used.
- `DB_LOAD_SNAPSHOT`: An optional variable that can be set with a path to a SQLite snapshot file. This setting is relevant when `NO_MONGO` is `true`. If provided, the SQLite database will be initialized from this snapshot.
- `DB_READONLY`: Set to `true` to disable persistence to SQLite.
- `REDIS_URL`: URL for the Redis connection.
- `NO_REDIS`: Set to `true` to use a mocked Redis client.

### Database Initialization

The backend toggles between MongoDB and Mingo for database operations, influenced by environment settings:

- **MongoDB**: Used when `MONGO_URL` is set and `NO_MONGO` is `false`.
- **Mingo and SQLite**: Activated by setting `NO_MONGO` to `true`. Mingo handles operations, while SQLite is used solely for data persistence, initialized from `DB_PATH` if provided.
- **SQLite Snapshot**: When `DB_LOAD_SNAPSHOT` is set, SQLite is initialized with this pre-populated data snapshot and pulls data to Mingo.

This setup ensures flexibility in database management based on environment configurations.
Data persistence can be disabled by passing an empty string to `DB_PATH`.

## Usage

To use the backend package in your StartupJS project, import and initialize it as follows:

```js
import getBackend from '@startupjs/backend'

export default async function runServer () {
  const backend = await getBackend(options)
  // ...
}
```

where `options` are:

- `pollDebounce`: the minimum delay between subsequent database polls. It is used individually for each collection in the database. This is used to batch updates and reduce load on the database.

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
