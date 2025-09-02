# startupjs ui
> UI components for react-native

## Installation

```sh
yarn add @startupjs/ui
```

If you plan to use Azure Blob Storage in FileInput component, add extra packages

```sh
yarn add @azure/storage-blob
```

### Requirements

```
@react-native-picker/picker: >=1.16.1
react: 16.9 - 17
react-native: >= 0.61.4 < 0.64.0
react-native-gesture-handler: >= 1.10.3
react-native-pager-view: >= 6.2.0
react-native-svg: >= 12.1.0
react-native-tab-view: >= 3.0.0
startupjs: >= 0.33.0
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

function getHead () {
  return `
    ${getUiHead()}
    other head text
  `
}
```

## Top-level UiProvider component

Wrap your app into a top-level `UiProvider` component

```js
import { UiProvider } from '@startupjs/ui'

...

<UiProvider style={ styleOverrides }>
  <App />
</UiProvider>
```

where `styleOverrides` is the styles to override default components' styles and for the override to work the component must be wrapped into `themed()` decorator. The override syntax looks requires that component is referred as a class by its name (starting with a capital letter) in the `.styl` file. For example `Button` is referred as `.Button`:

```styl
.Button
  color red
  &:part(hover)
    color green
  &:part(active)
    color blue
```

## Usage
```js
import { Button } from '@startupjs/ui'
```

## Additional materials
- [Material design](https://material.io/design/)

## TODO

- document `themed()` HOF and theming overall
