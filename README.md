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
You only need `docker` for this. And it works everywhere -- Windows, MacOS, Linux.

Keep in mind though that since the docker uses its own driver to mount folders, the
performance (especially when installing modules) might be considerably slower compared
to the native installation when working with large amount of files.

Install dependencies using yarn within the docker container:

```
./docker install
```

Run the app (also runs mongo and redis inside):

```
./docker
```

Open `http://localhost:3000` and you should see your app.

### Working with container's shell

Use container's shell to install new modules with yarn or run any other commands.

To enter shell on the running container:

```
./docker exec
```

If you don't have the container running, you can start it in shell-only mode using:

```
./docker sh
```

Note that `./docker sh` won't run usual initialization logic so the databases won't get started.
If you want to also start databases when entering shell, do this instead:

```
./docker sh-init
```

## Packages

### [App](https://github.com/dmapper/startupjs/blob/master/packages/app)

### [Backend](https://github.com/dmapper/startupjs/blob/master/packages/backend)

### [Bundler](https://github.com/dmapper/startupjs/blob/master/packages/bundler)

### [CLI](https://github.com/dmapper/startupjs/blob/master/packages/cli)

### [Cron](https://github.com/dmapper/startupjs/blob/master/packages/cron)

### [Init](https://github.com/dmapper/startupjs/blob/master/packages/init)

### [Model](https://github.com/dmapper/startupjs/blob/master/packages/model)

### [Offline](https://github.com/dmapper/startupjs/blob/master/packages/offline)

### [ORM](https://github.com/dmapper/startupjs/blob/master/packages/orm)

### [React sharedb](https://github.com/dmapper/startupjs/blob/master/packages/react-sharedb)

### [Routes middleware](https://github.com/dmapper/startupjs/blob/master/packages/routes-middleware)

### [Server](https://github.com/dmapper/startupjs/blob/master/packages/server)
