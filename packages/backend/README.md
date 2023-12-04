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

## Configuration

The package can be configured using the following environment variables:

- `MONGO_URL`: URL for the MongoDB connection. If set and `NO_MONGO` is not true, MongoDB will be used as the database.
- `NO_MONGO`: Set to true to disable MongoDB and fallback to SQLite.
- `DB_PATH`: The file path for the SQLite database. If not set, a default 'sqlite.db' file will be used.
- `DB_LOAD_SNAPSHOT`: Optional path to a SQLite snapshot file. If provided, the database will be initialized from this snapshot
- `REDIS_URL`: URL for the Redis connection.
- `NO_REDIS`: Set to true to use a mocked Redis client.
### Database Initialization

The backend supports both MongoDB and SQLite databases. It automatically chooses the database based on the provided environment variables:

- If `MONGO_URL` is provided and `NO_MONGO` is not true, it connects to MongoDB.
- If MongoDB is not used, it falls back to SQLite. The SQLite database is either created or loaded from `DB_PATH`.
- If `DB_LOAD_SNAPSHOT` is provided, the database is initialized from this snapshot, allowing for pre-populated data setups.

### Read-Only Mode

The backend can operate in a read-only mode for SQLite databases. This is determined by the `DB_PATH` variable. If `DB_PATH` is an empty string, the SQLite database will be in read-only mode.

### Data Persistence and Cloning

The backend includes advanced handling for data persistence and cloning in SQLite:

- Changes to the database are persisted in real-time.
- The ability to clone data from a source SQLite database to a target database is provided, facilitating data migration and testing scenarios.

## Usage

To use the backend package in your StartupJS project, import and initialize it as follows:

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
