# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
```

## Configuration
1. Add to your `startupjs.config.js` config file `ui` configuration (pallete, colors, variables and etc).

```js
const getConfig = require('@startupjs/ui/config')
const { u } = require('@startupjs/ui/config/helpers')

module.exports = {
  ui: getConfig({
    // override defaults
    blue: {
      primary: '#4a76a8',
    },
    colors: {
      dark: 'rgba(0, 0, 0, 0.5)'
    },
    MyComponent1: {
      height: u(2)
    },
    MyComponent2: {
      color: config.colors.primary,
      padding: u(1)
    }
  })
}
```

2. Add to your root style file `styles/index.styl`.
```css
@require '../node_modules/@startupjs/ui/styles/index.styl'
```

3. Add `@startupjs/ui` to `forceCompileModules` of your `webpack.web.config.js`:
```js
  const getConfig = require('startupjs/bundler').webpackWebConfig

  module.exports = getConfig(undefined, {
    forceCompileModules: ['@startupjs/ui']
  })
```

4. Install and configure additional modules below:

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

3. Add `sourceExts` to `metro.config.js`
```js
  config.resolver.sourceExts = ['ts', 'tsx']
```

4. Usage example
```js
  import { Icon } from '@startupjs/ui'
  import { faCoffee } from '@fortawesome/free-solid-svg-icons'

  export default observer(function Card ({
    return pug`
      Icon(icon=faCoffee size='l')
    `
  })
```

### Status bar

1. Install library `react-native-status-bar-height`
```
  yarn add react-native-status-bar-height
```

2. Add library to `forceCompileModules` of your `webpack.web.config.js`.
```js
  const getConfig = require('startupjs/bundler').webpackWebConfig

  module.exports = getConfig(undefined, {
    forceCompileModules: ['react-native-status-bar-height']
  })
```

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
