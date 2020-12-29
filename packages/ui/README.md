# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
```

### Requirements

```
  react-native-collapsible
  react-native-svg
  react-native-gesture-handler
  react-native-reanimated
```

### Linking
Link startupjs library (required for all React Native versions)

```
  npx startupjs link
```

## Configuration
1. Import UI styles in your root style file `styles/index.styl`. You can also override any default configuration here (palette, colors, variables, etc.):
```styl
@require('../node_modules/@startupjs/ui/styles/index.styl')
$UI = merge($UI, {
  colors: {
    primary: '#4a76a8',
    warning: '#880000'
  },
  Button: {
    heights: {
      xxl: 10u
    },
    outlinedBorderWidth: 2px
  }
}, true)
```

2. Connect styles from external CSS

Import `initUi` and` getUiHead` and connect them in the body of the `startupjsServer` and `getHead` functions in `server/index.js`.

```js
import { getUiHead, initUi } from '@startupjs/ui/server'

startupjsServer({
  getHead,
  ...
}, (ee, options) => {
  ...
  initUi(ee, options)
  ...
})

function getHead (appName) {
  return `
    ${getUiHead()}
    other head text
  `
}
```

Add module `@startupjs/ui/server` to `forceCompileModules` in `webpack.server.config.cjs`

```js
const getConfig = require('startupjs/bundler.cjs').webpackServerConfig

module.exports = getConfig(undefined, {
  forceCompileModules: ['@startupjs/ui/server']
})
```

## Usage
```js
import { Button } from '@startupjs/ui'
```

## Additional materials
- [Material design](https://material.io/design/)

## TODO

- document `themed()` HOF and theming overall
