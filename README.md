# startupjs

Installation:

**Step 1: Initialize new React Native project**

Change *appname* to the name of your app in lowercase and without dashes or underscores.

```bash
npx react-native init appname
cd appname
```

If you want to use the RC version of RN, use the following command instead:

```bash
npx react-native@next init appname --version next
```

This will create a new React Native project in the *appname* folder.

**Step 2: Install *startupjs* building blocks**

```bash
yarn add dm-bundler@alpha dm-sharedb-server@alpha react-sharedb@experimental
```

**Step 3: Configure Metro builder**

1. Change `babel.config.js` to:

```js
const { babelConfig } = require('dm-bundler')

// Override default babelrc config here.

// Default plugins are used for all targets - native, web and server:
// - babelrc.plugins

// There are also the following target-specific envs with their own presets and plugins:
// - babelrc.env.development         // native-only (client) dev
// - babelrc.env.production          // native-only (client) prod
// - babelrc.env.web_development     // web-only (client) dev
// - babelrc.env.web_production      // web-only (client) prod
// - babelrc.server                  // node.js (server) dev/prod

module.exports = babelConfig
```

2. 

**Step 4: Configure Webpack builder for Web**
