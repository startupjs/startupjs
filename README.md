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

1. Initialize a new project (change `awesomeapp` at the end to your app name):

```
docker run --rm -it --ulimit nofile=65535:65535 -v ${PWD}:/app startupjs/dev init awesomeapp
```

2. Go into the created project folder. Then run the development docker container with:

```
./docker
```

3. While inside the running container, start your app with:

```
yarn start
```

Open `http://localhost:3000` and you should see your app.

4. You can quickly exec into the running container from another terminal window using:

```
./docker exec
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
