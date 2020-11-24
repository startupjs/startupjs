# Mail service

## Installation

```sh
yarn add @startupjs/mail
```

or

```sh
npm i @startupjs/mail
```

## Configuration

### Add module to be force compiled by webpack

```
  // webpack.server.config.js
  const getConfig = require('startupjs/bundler.cjs').webpackServerConfig

  module.exports = getConfig(undefined, {
    forceCompileModules: [
      "@startupjs/mail"
    ],
    alias: {}
  })
```

### Init mail service:
// TODO:
