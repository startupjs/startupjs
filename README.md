# StartupJS

> :fire: React **Native + Web** framework with the isomorphic realtime storage engine and observables

[Introduction](#introduction)<br/>
[Requirements](#requirements)<br/>
[Quick start](#quick-start)<br/>
[Boilerplate templates](#boilerplate-templates)<br/>
[Running on mobile](#running-on-mobile)<br/>
[Docker development Quick Start](#docker-development-quick-start)<br/>
[IDE configuration](#ide-configuration)<br/>
[List of Packages](#list-of-packages)<br/>
[Contributing & Troubleshooting](#contributing--troubleshooting)<br/>
[Licence](#licence)

## Introduction

A full-stack framework which uses isomorphic web/native React frontend and NodeJS + MongoDB backend. All data manipulations are done through the isomorphic *React-* and *NodeJS-* *integrated* collaborative real-time observable Model.

StartupJS stack is built on top of the following libraries and technologies:

1. [React](https://reactjs.org/) and/or [react-native-web](https://github.com/necolas/react-native-web) for the Web-frontend.
1. [React Native](https://facebook.github.io/react-native/) for the Native-frontend (iOS, Android, etc.).
1. [React-ShareDB](https://github.com/dmapper/startupjs/blob/master/packages/react-sharedb):
    - A [ShareDB](https://github.com/share/sharedb) real-time collaborative database integration into React.
    - Allows to sync data between your local state (similar to Redux) and the DB.
    - Brings in collaboration functionality similar to Google Docs, where multiple users can edit the same data simultaneously.
    - Uses WebSockets to send micro-patches to and from the server whenever there are any changes to the data you are subscribed to.
    - Uses observables to automatically rerender the data in React, similar to [MobX](https://mobx.js.org/).
1. [Model](https://derbyjs.com/docs/derby-0.10/models) based on [Racer](https://github.com/derbyjs/racer) with an ability to create [custom ORM methods](https://github.com/dmapper/startupjs/blob/master/packages/orm).
1. [React Router](https://reacttraining.com/react-router/) for routing and navigation with an ability to separate your frontend into [multiple frontent mircoservices](https://github.com/dmapper/startupjs/blob/master/packages/app) (e.g. `main` and `admin`)
1. [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the backend.
1. [MongoDB](https://docs.mongodb.com/manual/installation/) for the database.
1. [Redis](https://redis.io/) for the pub/sub (required by ShareDB) and locking functionality.
1. [Offline support](https://github.com/dmapper/startupjs/tree/master/packages/offline) with an ability to [query data locally](https://github.com/kofrasa/mingo) using the MongoDB queries and aggregations language.
1. Code Quality control tools:
    - [ESLint](https://eslint.org/)
    - *optional* [TypeScript](https://www.typescriptlang.org/)

## Requirements

- [Node](https://nodejs.org/) >= 12.0
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://docs.mongodb.com/manual/installation/) 4.0
- [Redis](https://redis.io/) 5.0
- [Android SDK](https://developer.android.com/sdk/) (*optional*) for Android development
- [Xcode](https://developer.apple.com/xcode/) (*optional*) for iOS Development

**OR**

- [Docker](https://docs.docker.com/install/) (Instead of *Quick start*, follow the instructions in [Docker development Quick Start](#docker-development-quick-start) section)

## Quick start

1. Initialize a new [`simple` boilerplate](#boilerplate-templates) project. Change `myapp` to your project name (use lower case).

    ```
    npx startupjs init myapp
    ```

2. Go into the created project folder and start the web application with:

    ```
    yarn start
    ```

3. Open http://localhost:3000 and start developing!

## Boilerplate templates

Following templates are available:

1. `simple` (default)
2. `routing` - plugs in [`@startupjs/app`](/packages/app) which provides a `react-router` routing implementation

By default `init` creates a project using the `simple` template.

To use a template with built-in routing, specify it using the `-t` option:

```
... init myapp -t routing
```

Each template initializes on top of a default `react-native init` application.

If you want to use an RC version (`next`) of `react-native`, specify it using the `-v` option:

```
... init myapp -v next
```

You can combine `-t` and `-v` options together. `react-native init` will run first and afterwards the boilerplate template will be  copied over.

## Running on mobile

`yarn start` actually combines 2 commands together: `yarn server` and `yarn web`.

In order to develop your app on mobile, you'll have to open a bunch of tabs anyways, so it makes sense
to also run `server` and `web` separately instead of using the `yarn start`.

Here is the list of commands to run all platforms at the same time:

1. Start **server** (required) *in a separate terminal tab*

    ```
    yarn server
    ```

2. Start **web** (optional) *in a separate terminal tab*

    ```
    yarn web
    ```

3. Start **metro** (required for Android and/or iOS) *in a separate terminal tab*

    ```
    yarn metro
    ```

5. Run **android** (optional) *in a separate terminal tab*

    ```
    yarn android
    ```

6. Run **ios** (optional) *in a separate terminal tab*

    ```
    yarn ios
    ```

## Docker development Quick Start

Alternatively you can run a docker development image which has node, yarn, mongo and redis already built in.
You only need `docker` for this. And it works everywhere -- Windows, MacOS, Linux.

Keep in mind though that since docker uses its own driver to mount folders,
performance (especially when installing modules) might be considerably slower compared
to the native installation when working with the large amount of files.

1. Initialize a new [`simple` boilerplate](#boilerplate-templates) project. Change `myapp` at the end to your project name (use lower case).

    ```
    docker run --rm -it -v ${PWD}:/ws:delegated startupjs/dev init myapp
    ```

2. Go into the created project folder. Then run the development docker container with:

    ```
    ./docker
    ```

3. While inside the running container, start your app with:

    ```
    yarn start
    ```

4. Open http://localhost:3000 and start developing!

5. When you want to open an additional terminal window, you can quickly exec into the running container using:

    ```
    ./docker exec
    ```

## IDE configuration

### Visual Studio Code

#### Step 1: Add support for PUG syntax highlighting

1. Install extension [`vscode-react-pug`](https://github.com/kaminaly/vscode-react-pug)
2. Restart VS Code

#### Step 2: Add support for ESLint errors highlighting

1. Install extension `ESLint`
2. Restart VS Code

### Atom

#### Step 1: Add support for PUG syntax highlighting

1.  Install packages [language-babel](https://atom.io/packages/language-babel) and [language-pug](https://atom.io/packages/language-pug)
2.  Open settings of `language-babel` in atom
3.  Find the field under "JavaScript Tagged Template Literal Grammar Extensions"
4.  Enter: `pug:source.pug`
5.  Go to `Core` settings of atom.
6.  Uncheck `Use Tree Sitter Parsers`
7.  Restart Atom

#### Step 2: Add support for ESLint errors highlighting

1.  Install pagkage `linter-eslint`
2.  Restart Atom

## List of Packages

- [App](https://github.com/dmapper/startupjs/blob/master/packages/app)
- [Backend](https://github.com/dmapper/startupjs/blob/master/packages/backend)
- [Bundler](https://github.com/dmapper/startupjs/blob/master/packages/bundler)
- [CLI](https://github.com/dmapper/startupjs/blob/master/packages/cli)
- [CodePush](https://github.com/dmapper/startupjs/blob/master/packages/codepush)
- [Cron](https://github.com/dmapper/startupjs/blob/master/packages/cron)
- [Init](https://github.com/dmapper/startupjs/blob/master/packages/init)
- [Model](https://github.com/dmapper/startupjs/blob/master/packages/model)
- [Offline](https://github.com/dmapper/startupjs/blob/master/packages/offline)
- [ORM](https://github.com/dmapper/startupjs/blob/master/packages/orm)
- [React sharedb](https://github.com/dmapper/startupjs/blob/master/packages/react-sharedb)
- [Routes middleware](https://github.com/dmapper/startupjs/blob/master/packages/routes-middleware)
- [Server](https://github.com/dmapper/startupjs/blob/master/packages/server)
- [StartupJS meta package](https://github.com/dmapper/startupjs/blob/master/packages/startupjs)

## [CodePush setup](/docs/codepush.md)

## Contributing & Troubleshooting

If you have any questions or want to request a feature, please look wether a similar issue already existis in this repo, otherwise feel free to file a new one.

If you want to contribute, feel free to send your PRs, we will review them and provide our feedback on a short notice.

## Licence

MIT
