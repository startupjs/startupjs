# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
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

3. Install and configure additional modules below:

### Collapse

1. Install library `react-native-collapsible`
```
  yarn add react-native-collapsible
```

2. Add library to `forceCompileModules` of your `webpack.web.config.js`.
```js
  const getConfig = require('startupjs/bundler').webpackWebConfig

  module.exports = getConfig(undefined, {
    forceCompileModules: ['react-native-collapsible']
  })
```

### Icon component

1. Install library `react-native-svg`
```
  yarn add react-native-svg
```

2. Link native code
```
  cd ios && pod install
```

3. Usage example
```js
  import { Icon } from '@startupjs/ui'
  import { faCoffee } from '@fortawesome/free-solid-svg-icons'

  export default observer(function Card ({
    return pug`
      Icon(icon=faCoffee size='l')
    `
  })
```

### Tabs
Requires install `react-native-gesture-handler` and `react-native-reanimated`.

There are additional steps required for `react-native-gesture-handler` on Android after linking (for all React Native versions). Check the [this guide](https://docs.swmansion.com/react-native-gesture-handler/docs/) to complete the installation.

### TextInput
Set cursor color of the input on android for the same view as web
and ios in `%PROJECT%/android/app/src/res/values/styles.xml`.

```xml
  <resources>
    <!-- ...other configs... -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
      <item name="android:textColor">#000000</item>
      <!-- sets cursor color -->
      <item name="colorControlActivated">#2962FF</item>
    </style>
    <!-- ...other configs... -->
  </resources>
```

## Usage
```js
import { Button } from '@startupjs/ui'
```

## Additional materials
- [Material design](https://material.io/design/)

## TODO

- document `themed()` HOF and theming overall
