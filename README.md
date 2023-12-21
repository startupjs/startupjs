![Cover](https://user-images.githubusercontent.com/62799316/150987762-a6c2ef75-1396-4817-aab7-d4ee7a87b27b.png)

<div align="center">
  <h1>
    StartupJS &middot;
    <a href="https://www.npmjs.com/package/startupjs"><img src="https://img.shields.io/npm/v/startupjs.svg?style=flat" /></a>
    <a href="#contributing--troubleshooting"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
    <img src="https://img.shields.io/badge/license-MIT-blue" />
  </h1>
  <a href="#quickstart">Quickstart</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#native-development-ios-and-android">Native&nbsp;development</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#ide-configuration">IDE&nbsp;support</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#documentation">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#sub-packages-documentation">Packages</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#version-migration-guides">Migration</a>
</div>

## What is StartupJS?

StartupJS is a **full-stack framework** that consists of:

- **Frontend**: Isomorphic React [native](https://facebook.github.io/react-native/) and [web](https://github.com/necolas/react-native-web)
- **Backend**: [ExpressJS](https://expressjs.com/)
- **Collaborative Database**: [MongoDB](https://www.mongodb.com/) which runs behind [ShareDB](https://github.com/share/sharedb) and a client-server observable [ORM](https://derbyjs.com/docs/derby-0.10/models)

## Quickstart

### Requirements

StartupJS app requires: [Node 20.10+](https://nodejs.org/), [Yarn](https://yarnpkg.com/)

Alternatively, you can run everything in [Docker](https://docs.docker.com/install/), in which case follow [Docker development Quick Start](#docker-development-quick-start). **Important** to note is that Docker won't allow you to test Android or iOS.

### Installation

> [!WARNING]
> StartupJS does not yet support the latest version of React Native.
> 
> When creating a new project please specify the `0.72` version:
>
>    ```
>    npx startupjs@latest init myapp --react-native 0.72
>    ```

1. Initialize a default [`ui` template](#official-app-templates) project, change `myapp` to your project name (use lower case):

    ```
    npx startupjs@latest init myapp
    ```

2. Go into the created project folder and start the web application with:

    ```
    yarn start
    ```

3. Open http://localhost:3000 and start developing!

## Native Development (iOS and Android)

### Requiremens

Follow the [React Native guide](https://reactnative.dev/docs/environment-setup) to setup everything.
StartupJS uses native modules, so you have to follow `React Native CLI Quickstart`, not the `Expo` guide.

### How to run StartupJS on native

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

### [![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-grey?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)

#### Step 1: Add support for PUG syntax highlighting

1. Install extension [`vscode-react-pug`](https://github.com/kaminaly/vscode-react-pug)
2. Restart VS Code

#### Step 2: Add support for ESLint errors highlighting

1. Install extension `ESLint`
2. Restart VS Code

### [![Atom](https://img.shields.io/badge/Atom-grey?style=for-the-badge&logo=atom)](https://atom.io/)

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

The main things you'll need to know to get started with StartupJS are:

1. [React Native](https://reactnative.dev/)
1. [Racer's Model](https://derbyjs.com/docs/derby-0.10/models). You only need to read the `MODELS` section, ignore everything else.
1. [React hooks for Model](/packages/react-sharedb-hooks)
1. [StartupJS UI Components](https://startupjs-ui.dev.dmapper.co)

Before launching your app to production you are strongly encouraged to implement:

1. [Security](#security)

For additional documentation on each StartupJS package see the [according readme](#sub-packages-documentation)

### Advanced

To gain further deep knowledge of StartupJS stack you'll need get familiar with the following technologies it's built on:

1. [React](https://reactjs.org/) and/or [react-native-web](https://github.com/necolas/react-native-web) for the Web-frontend.
1. [React Native](https://facebook.github.io/react-native/) for the Native-frontend (iOS, Android, etc.).
1. [Pug](https://pugjs.org/) which is used besides JSX for templating.
1. [Stylus](https://stylus-lang.com/) which is used besides CSS for stylesheets.
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
1. Code Quality control tools:
    - [ESLint](https://eslint.org/)
    - *optional* [TypeScript](https://www.typescriptlang.org/)

### Sub-Packages Documentation

- [App](/packages/app)
- [Babel preset startupjs](/packages/babel-preset-startupjs)
- [Backend](/packages/backend)
- [Bundler](/packages/bundler)
- [CLI](/packages/cli)
- [Cron](/packages/cron)
- [Docs](/packages/docs)
- [Hooks](/packages/hooks)
- [Init](/packages/init)
- [Model](/packages/model)
- [Offline](/packages/offline)
- [ORM](/packages/orm)
- [React sharedb](/packages/react-sharedb)
- [Server](/packages/server)
- [StartupJS meta package](/packages/startupjs)
- [UI](/packages/ui)

## Official App Templates

The following templates are available:

1. `simple`
2. `routing` - plugs in [`@startupjs/app`](/packages/app) which provides a `react-router` routing implementation
3. `ui` (default) - plugs in routing and [`@startupjs/ui`](https://startupjs-ui.dev.dmapper.co)

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

If you want to use an RC version (`next`) of `react-native` or a specific version like `0.72`, specify it using the `--react-native` option:

```
npx startupjs init myapp --react-native next
```

## Docker development Quick Start

Alternatively you can run a docker development image which has node, yarn, mongo and redis already built in.
You only need `docker` for this. And it works everywhere -- Windows, MacOS, Linux.

Keep in mind though that since docker uses its own driver to mount folders,
performance (especially when installing modules) might be considerably slower compared
to the native installation when working with the large amount of files.

1. Initialize a new [`ui` boilerplate](#official-app-templates) project. Change `myapp` at the end to your project name (use lower case).

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

- [Migration Guides](/docs/migration-guides)

## Security

StartupJS server is designed to be secure by default.

For the sake of simplifying quick prototyping, a new project you create with `startupjs init` will have security mechanisms turned off.

You are strongly encouraged to implement security for your project as early as possible by removing `secure: false` flag from the server initialization in your `server/index.js` file.

There are 3 types of security mechanisms you must implement:

- [Access Control to MongoDB documents](https://github.com/startupjs/startupjs/tree/master/packages/sharedb-access)
- [Server-only MongoDB Aggregations](https://github.com/startupjs/startupjs/tree/master/packages/server-aggregate)
- [Validation of MongoDB documents using JSON Schema](https://github.com/startupjs/startupjs/tree/master/packages/sharedb-schema)

If you want to work on their implementation one by one, you can keep the `secure: false` flag and only add the ones you want to implement by specifying the following flags:

```js
accessControl: true,
serverAggregate: true,
validateSchema: true
```

**NOTE**: All 3 mechanisms are integrated for their simpler use into the ORM system. We are working on a guide on how to use them with the ORM. If you want help properly integrating it into your production project, please file an issue or contact [cray0000](https://github.com/cray0000) directly via email.

## Contributing & Troubleshooting

See [CONTRIBUTING.md](/CONTRIBUTING.md)

## License

MIT

© Pavel Zhukov
