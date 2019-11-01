# StartupJS

> React Native + Web + Node.js full-stack framework

## Requirements

1. MongoDB 4.0
2. Redis 5.0

## Quick start

1. Initialize a new boilerplate project. Change `myapp` to your project name (use lower case)

```
npx startupjs init myapp --version=latest && cd myapp
```

2. Start **server** (in a separate terminal tab)

```
yarn server
```

3. Start **web** (in a separate terminal tab). Open `http://localhost:3000`

```
yarn web
```

4. Start **metro**, if you want to develop native iOS or Android apps (in a separate terminal tab)

```
yarn metro
```

5. Run **android** (in a separate terminal tab)

```
yarn android
```

6. Run **ios** (in a separate terminal tab)

```
yarn ios
```

## Docker development

Alternatively you can run a docker development image which has mongo and redis already built in.
You only need `docker` and `make` installed for this.

Install dependencies using yarn within the docker container:

```
make yarn
```

Run the app in docker (also runs mongo and redis inside):

```
make
```

## Packages

### [Backend](https://github.com/dmapper/startupjs/blob/master/packages/backend/README.md)

### [Bundler](https://github.com/dmapper/startupjs/blob/master/packages/bundler/README.md)

### [CLI](https://github.com/dmapper/startupjs/blob/master/packages/cli/README.md)

### [Cron](https://github.com/dmapper/startupjs/blob/master/packages/cron/README.md)

### [Init](https://github.com/dmapper/startupjs/blob/master/packages/init/README.md)

### [Model](https://github.com/dmapper/startupjs/blob/master/packages/model/README.md)

### [Offline](https://github.com/dmapper/startupjs/blob/master/packages/offline/README.md)

### [ORM](https://github.com/dmapper/startupjs/blob/master/packages/orm/README.md)

### [React sharedb](https://github.com/dmapper/startupjs/blob/master/packages/react-sharedb/README.md)

### [Routes middleware](https://github.com/dmapper/startupjs/blob/master/packages/routes-middleware/README.md)

### [Server](https://github.com/dmapper/startupjs/blob/master/packages/server/README.md)
