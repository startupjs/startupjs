# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
```

### Requirements

```
@react-native-community/datetimepicker: ^3.0.6
@react-native-picker/picker: >=1.9.3
react: 16.9 - 17
react-native: >= 0.61.4 < 0.64.0
react-native-collapsible: 1.5.2
react-native-gesture-handler: 1.9.0
react-native-reanimated: >= 1.13.2
react-native-svg: >= 12.1.0
react-native-tab-view: >= 2.15.2
startupjs: >= 0.33.0-alpha.0
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

## App plugin
Register ui plugin for app

```js
import { registerPlugins } from '@startupjs/plugin'
import { uiAppPlugin } from '@startupjs/ui'

...

registerPlugins({
  '@startupjs/app': [
    [uiAppPlugin, { defaultEnable: true }]
  ]
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
