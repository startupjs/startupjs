# startupjs test app

> This app is used to test startupjs features.

## Setup

### Install dependencies

```sh
yarn
```

### Run real Redis

`@startupjs/worker` has to connect to real Redis for job processing. It can not use `ioredis-mock` which is used by default otherwise for local development.

Make sure Redis is running locally and create `expoapp/.env.local` file with the following content:

```
REDIS_URL=redis://localhost:6379/10
```

## Start the app

```bash
yarn start
```
