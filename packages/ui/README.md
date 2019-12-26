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

### Icon component
1. Install fontawesome node module
```
yarn add @fortawesome/react-native-fontawesome
```

2. Install support for fontawesome svg
```
yarn add @fortawesome/fontawesome-svg-core
yarn add react-native-svg
```

3. Install your preferred icon set
```
yarn add @fortawesome/free-brands-svg-icons
#or
yarn add @fortawesome/free-solid-svg-icons
#or
yarn add @fortawesome/free-regular-svg-icons
```

4. Create icons.js in the main folder (main/icons.js)
```js
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faSearch, ... } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash, faSearch, ...)
```

5. Import this in main/index.js
```js
import * as pages from './pages'
import getRoutes from './routes'
import './icons.js'
  
export { Layout } from 'ui'
export const routes = getRoutes(pages)
```

6. Add in metro.config.js for react-native-svg transpile
```js
// ...
config.resolver.sourceExts = config.resolver.sourceExts.concat([
  'ts',
  'tsx'
])
// ...
```

7. Example use Icon component
```js
import { Icon } from '@startupjs/ui'
// ...
Icon(
  name='star'
  type='fa'
  size='l'
)
```
[See more props](https://github.com/dmapper/startupjs/blob/ui/packages/ui/components/Icon/index.js#L40)

## Additional materials
- [Material design](https://material.io/design/)
