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
  <a href="#version-migration-guides">Migration</a>
</div>

## What is StartupJS?

StartupJS is a **full-stack framework** that consists of:

- **Frontend**: Isomorphic React [native](https://facebook.github.io/react-native/) and [web](https://react.dev/)
- **Backend**: [ExpressJS](https://expressjs.com/)
- **Collaborative Database**: [MongoDB](https://www.mongodb.com/) which runs behind [ShareDB](https://github.com/share/sharedb) and a client-server observable [ORM](https://teamplay.dev/)

## Quickstart

### Requirements

StartupJS app requires:

- [Node 22+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (optional, but strongly recommended)

### Installation

1. Create a new Expo app and go into it:

    **Note:** You can use any Expo template you want

    - if you are using **yarn**:

        ```
        yarn create expo-app myapp
        ```

        ```
        cd myapp
        ```

        ```
        corepack enable && echo 'nodeLinker: node-modules' > .yarnrc.yml && corepack use yarn@4
        ```

        > **Warning:** If you are on Mac, you might first need to install `corepack` separately with:
        >
        >    ```
        >    brew install corepack
        >    ```

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

4. Start expo app with `npm start` or `yarn start`

5. If Fast Refresh (hot reloading) is not working (this might be the case if you created a bare expo project),
add `import '@expo/metro-runtime'` to the top of your entry file.

## Known issues

On the current version of Expo the Hermes JS engine does not support `FinalizationRegistry` yet on iOS/Android.
Because of this there are known memory leaks. To workaround this issue until Hermes adds support for it, please
specify a different JS engine (`jsc`) in `app.json`:

```json
{
  "expo": {
    "jsEngine": "jsc"
  }
}
```

## Native Development (iOS and Android)

### Requiremens

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

Before launching your app to production you are strongly encouraged to implement:

1. [Security](#security)

### Advanced

To gain further deep knowledge of StartupJS stack you'll need get familiar with the following technologies it's built on:

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
