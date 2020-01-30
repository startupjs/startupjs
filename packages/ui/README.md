# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
```

## Configuration
Pass to your `startupjs.config.js` config file `ui` configuration (pallete, colors, variables and etc).

```js
const config = require('@startupjs/ui/rootConfig')
const { u } = require('@startupjs/ui/configHelpers')

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

## Usage
```js
import { Button } from '@startupjs/ui'
```

## Dependences

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

## Additional materials
- [Material design](https://material.io/design/)

## TODO

- document `themed()` HOF and theming overall
