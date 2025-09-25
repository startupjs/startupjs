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
  <a href="#production">Production</a>
</div>

## What is StartupJS?

StartupJS is a **full-stack framework** that consists of:

- **Frontend**
  - Isomorphic React [native](https://facebook.github.io/react-native/) and [web](https://react.dev/) based on [Expo](https://expo.dev/)
- **Backend**
  - [ExpressJS](https://expressjs.com/)
- **Collaborative Database**
  - [MongoDB](https://www.mongodb.com/) which runs behind [ShareDB](https://github.com/share/sharedb) and a client-server observable [Teamplay ORM](https://teamplay.dev/)

## Quickstart

### Requirements

StartupJS app requires:

- [Node 22+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (optional, but strongly recommended)

### Installation

1. Create a new Expo app and go into it:

    **Note:** You can use any Expo template you want

    - if you are using **yarn** (recommended):

        ```
        yarn create expo-app myapp
        ```

        ```
        cd myapp
        ```

        ```
        corepack enable && echo 'nodeLinker: node-modules' > .yarnrc.yml && corepack use yarn@4
        ```

        > **Warning:** If `corepack` is not installed in your system, install it with:
        >
        >    ```
        >    npm install -g corepack
        >    ```
        >
        > and re-run the last command.

    - if you are using **npm**:

        ```
        npx create-expo-app@latest myapp
        ```

        ```
        cd myapp
        ```

2. Install startupjs into your app:

    ```
    npm init startupjs@canary
    ```

3. Wrap your root component into `<StartupjsProvider>` from `startupjs` (when using expo-router it's in `app/_layout.tsx`):

    ```jsx
    import { StartupjsProvider } from 'startupjs'
    // ...
    return (
      <StartupjsProvider>
        ...
      </StartupjsProvider>
    )
    ```

4. Start expo app with `yarn start` (or `npm start`).

> [!WARNING]
> If Fast Refresh (hot reloading) is not working (this might be the case if you created a bare expo project),
> add `import '@expo/metro-runtime'` to the top of your entry file.

### Upgrading to newer StartupJS versions

```
npx startupjs install --fix
```

This will upgrade to the latest minor version of `startupjs` and all the `@startupjs/*` packages and also upgrade Expo and all its packages to the latest minor version.

If you want to upgrade to a newer BREAKING version -- manually change the `startupjs` and `expo` to a higher major version and then run the same command `npx startupjs install --fix`. When upgrading to a new breaking version you might have to run this command twice.

## Native Development (iOS and Android)

StartupJS uses Expo by default which should guide you through installation steps itself, just run `yarn start -c`
(`-c` flag is to clear the JS compilation cache) and press `i` to launch iOS simulator or `a` to launch Android simulator.

## IDE configuration

### [![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-grey?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)

#### Step 1: Add support for ESLint errors highlighting

1. Install extension [`vscode-eslint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. Restart VS Code

#### Step 2 (optional): Pug syntax highlighting

If you are gonna be using `pug` instead of pure JSX, add support for Pug syntax highlighting:

1. Install extension [`vscode-react-pug`](https://marketplace.visualstudio.com/items?itemName=kaminaly.vscode-react-pug)
2. Restart VS Code

#### Step 3 (optional): Stylus syntax highlighting

If you are gonna be using `styl` to define styles, add support for Stylus syntax highlighting:

1. Install extension [`vscode-startupjs`](https://marketplace.visualstudio.com/items?itemName=startupjs.vscode-startupjs)
2. Restart VS Code

## Documentation

The main things you'll need to know to get started with StartupJS are:

1. [React Native](https://reactnative.dev/)
1. [Teamplay ORM](https://teamplay.dev/) (all `teamplay` stuff should be imported directly from `startupjs`)
1. [StartupJS UI Components](https://startupjs-ui.dev.dmapper.co)

To launch your app to production read the following sections:

1. [Production](#production)
1. [Security](#security)

## Production

To deploy your app to production, run `yarn build` to build the server and web code and `yarn start-production` to run it.

By default for local development instead of a full MongoDB and Redis the startupjs app uses their mocks ([`mingo`](https://github.com/kofrasa/mingo) and [`ioredis-mock`](https://github.com/stipsan/ioredis-mock)).

It is strongly recommended to use the actual MongoDB and Redis in production (and it is **required** if you want to run multiple instances of the application).

To use MongoDB and Redis, specify `MONGO_URL` and `REDIS_URL` environment variables when running the `yarn start-production` command.

You can also provide these environment variables when doing local development through the `yarn start -c` command.

To deploy the native apps use the [Expo EAS](https://expo.dev/eas) service -- `eas build` and `eas submit`.

## Advanced

To gain further deep knowledge of StartupJS stack you'll need to get familiar with the following technologies it's built on:

1. [React](https://reactjs.org/)
1. [React Native](https://facebook.github.io/react-native/) for the Native-frontend (iOS, Android, etc.).
1. [Teamplay ORM](https://teamplay.dev/).
1. [Expo Router](https://docs.expo.dev/router/introduction/) for routing and navigation.
1. [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the backend.
1. [MongoDB](https://docs.mongodb.com/manual/installation/) for the database.
1. [ShareDB](https://share.github.io/sharedb/):
    - A real-time collaborative database integration into React.
    - Allows to sync data between your local state (similar to Redux) and the DB.
    - Brings in collaboration functionality similar to Google Docs, where multiple users can edit the same data simultaneously.
    - Uses WebSockets to send micro-patches to and from the server whenever there are any changes to the data you are subscribed to.
    - Uses observables to automatically rerender the data in React, similar to [MobX](https://mobx.js.org/).
1. [Redis](https://redis.io/) for the pub/sub (required by ShareDB) and locking functionality.
1. [Pug](https://pugjs.org/) (optional) which is used besides JSX for templating.
1. [Stylus](https://stylus-lang.com/) (optional) which is used besides CSS and inline styling for stylesheets.
1. Code Quality control tools:
    - [ESLint](https://eslint.org/)
    - *optional* [TypeScript](https://www.typescriptlang.org/)

## Version migration guides

The following guides are available to assist with the migration to new major versions of StartupJS:

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
