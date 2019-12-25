# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
```

## Configuration
Pass to your `startupjs.config.js` config file `ui` configuration (pallete, colors, variables and etc).

```js
const defaultConfig = require('@startupjs/ui/config')
const { u } = require('@startupjs/ui/configHelpers')

module.exports = {
  ui: {
    ...defaultConfig,
    // override default
    MyComponent1: {
      height: u(2)
    },
    MyComponent2: {
      color: ui.colors.primary,
      padding: u(1)
    }
  }
}
```

## Usage
```js
import { Button } from '@startupjs/ui'
```

## Additional materials
- [Material design](https://material.io/design/)
