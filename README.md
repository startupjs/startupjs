![StartupJS](https://i.imgur.com/ZqbdTmB.png)

<div align="center">
  <h1>
    StartupJS &middot;
    <a href="https://www.npmjs.com/package/startupjs"><img src="https://img.shields.io/npm/v/startupjs.svg?style=flat" /></a>
    <a href="#contributing--troubleshooting"<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
    <img src="https://img.shields.io/badge/license-MIT-blue" />
  </h1>
  <a href="#quickstart">Quickstart</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#quickstart">Native&nbsp;development</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#quickstart">IDE&nbsp;support</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#quickstart">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#quickstart">Packages</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#quickstart">Migration</a>  
</div>

## What is StartupJS?

StartupJS is a **full-stack framework** that consists of:

- **Frontend**: Isomorphic React [native](https://facebook.github.io/react-native/) and [web](https://github.com/necolas/react-native-web)
- **Backend**: ExpressJS (on NodeJS)
- **Collaborative Database**: MongoDB which runs behind [ShareDB](https://github.com/share/sharedb) and a client-server [ORM](https://derbyjs.com/docs/derby-0.10/models)

## Quickstart

### Requirements

- [Node](https://nodejs.org/) >= 12.0
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://docs.mongodb.com/manual/installation/) 4.0
- [Redis](https://redis.io/) 5.0
- [Android SDK](https://developer.android.com/sdk/) (*optional*) for Android development
- [Xcode](https://developer.apple.com/xcode/) (*optional*) for iOS Development

**OR**

- [Docker](https://docs.docker.com/install/) (Instead of *Quick start*, follow the instructions in [Docker development Quick Start](#docker-development-quick-start) section)

### Installation

1. Initialize a new [`ui` boilerplate](#boilerplate-templates) project. Change `myapp` to your project name (use lower case).

    ```
    npx startupjs init myapp
    ```

2. Go into the created project folder and start the web application with:

    ```
    yarn start
    ```

3. Open http://localhost:3000 and start developing!

## Native Development (iOS and Android)

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

4. Run **android** (optional) *in a separate terminal tab*

    ```
    yarn android
    ```

5. Run **ios** (optional) *in a separate terminal tab*

    ```
    yarn ios
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

1.  Install package `linter-eslint`
2.  Restart Atom

## Documentation

### Basic

The main things you'll need to know to get started with StartupJS are:

1. [React Native](https://reactnative.dev/)
1. [`Racer`'s Model](https://derbyjs.com/docs/derby-0.10/models). You only need to read the `MODELS` section, ignore everything else.
1. [React hooks for Model](/packages/react-sharedb-hooks)
1. [StartupJS UI Components](https://startupjs-ui.dmapper.co)

For additional documentation on each StartupJS package see the [according readme](#sub-packages-documentation):

### Advanced

To gain further deep knowledge of StartupJS stack you'll need get familiar with the following technologies it's built on:

1. [React](https://reactjs.org/) and/or [react-native-web](https://github.com/necolas/react-native-web) for the Web-frontend.
1. [React Native](https://facebook.github.io/react-native/) for the Native-frontend (iOS, Android, etc.).
1. [React-ShareDB](/packages/react-sharedb):
    - A [ShareDB](https://github.com/share/sharedb) real-time collaborative database integration into React.
    - Allows to sync data between your local state (similar to Redux) and the DB.
    - Brings in collaboration functionality similar to Google Docs, where multiple users can edit the same data simultaneously.
    - Uses WebSockets to send micro-patches to and from the server whenever there are any changes to the data you are subscribed to.
    - Uses observables to automatically rerender the data in React, similar to [MobX](https://mobx.js.org/).
1. [Model](https://derbyjs.com/docs/derby-0.10/models) based on [Racer](https://github.com/derbyjs/racer) with an ability to create [custom ORM methods](/packages/orm).
1. [React Router](https://reacttraining.com/react-router/) for routing and navigation with an ability to separate your frontend into [multiple frontent mircoservices](/packages/app) (e.g. `main` and `admin`)
1. [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the backend.
1. [MongoDB](https://docs.mongodb.com/manual/installation/) for the database.
1. [Redis](https://redis.io/) for the pub/sub (required by ShareDB) and locking functionality.
1. [Offline support](/packages/offline) with an ability to [query data locally](https://github.com/kofrasa/mingo) using the MongoDB queries and aggregations language.
1. Code Quality control tools:
    - [ESLint](https://eslint.org/)
    - *optional* [TypeScript](https://www.typescriptlang.org/)

### Sub-Packages Documentation

- [App](/packages/app)
- [Babel preset startupjs](/packages/babel-preset-startupjs)
- [Backend](/packages/backend)
- [Bundler](/packages/bundler)
- [CLI](/packages/cli)
- [CodePush](/packages/codepush)
- [Cron](/packages/cron)
- [Docs](/packages/docs)
- [Hooks](/packages/hooks)
- [Init](/packages/init)
- [Model](/packages/model)
- [Offline](/packages/offline)
- [ORM](/packages/orm)
- [React sharedb](/packages/react-sharedb)
- [Routes middleware](/packages/routes-middleware)
- [Server](/packages/server)
- [StartupJS meta package](/packages/startupjs)
- [UI](/packages/ui)

## Boilerplate templates

The following templates are available:

1. `simple`
2. `routing` - plugs in [`@startupjs/app`](/packages/app) which provides a `react-router` routing implementation
3. `ui` (default) - plugs in routing and [`@startupjs/ui`](https://startupjs-ui.dmapper.co)

By default `init` creates a project using the feature-rich `ui` template.

To use another template specify the `-t` option:

```
npx startupjs init myapp -t simple
```

To create a new project using an alpha version of startupjs, append `@next` to the startupjs itself:

```
npx startupjs@next init myapp
```

Each template initializes on top of a default `react-native init` application.

If you want to use an RC version (`next`) of `react-native`, specify it using the `-rn` option:

```
npx startupjs init myapp -rn next
```

## Docker development Quick Start

Alternatively you can run a docker development image which has node, yarn, mongo and redis already built in.
You only need `docker` for this. And it works everywhere -- Windows, MacOS, Linux.

Keep in mind though that since docker uses its own driver to mount folders,
performance (especially when installing modules) might be considerably slower compared
to the native installation when working with the large amount of files.

1. Initialize a new [`ui` boilerplate](#boilerplate-templates) project. Change `myapp` at the end to your project name (use lower case).

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

## Version migration guides

The following guides are available to assist with migration to new major versions of StartupJS:

- [0.22 -> 0.23](/docs/migration-guides/0.22--0.23.md)

## Contributing & Troubleshooting

To initialize the monorepo, run:

```sh
yarn bootstrap
```

After that you can run the styleguide project to develop the UI components, etc.:

```sh
cd styleguide
yarn start
```

To cleanup all modules:

```sh
yarn clean
```

If you have any questions or want to request a feature, please look wether a similar issue already exists in this repo, otherwise feel free to file a new one.

If you want to contribute, feel free to send your PRs, we will review them and provide our feedback on a short notice.

## Licence

MIT

© Pavel Zhukov
