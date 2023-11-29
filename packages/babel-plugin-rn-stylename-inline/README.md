# @startupjs/babel-plugin-rn-stylename-inline

Adds support for in-JS template strings `css\`\`` and `styl\`\``
for CSS styles for react-native.

Must be used together with `@startupjs/babel-plugin-rn-stylename` library.

## Options

`platform` -- what platform the compilation is on. For example, `web` or `ios` or `android`.

## Example

### File-level scope (global to file)

```jsx
import React from 'react'
import { View } from 'react-native'
import { css } from 'startupjs'

export default function Card () {
  return <View styleName='card active'><Line /></View>
}
function Line () {
  return <View styleName='line' />
}
css`
  .card {
    padding: 8px 16px;
  }
  .line {
    margin-top: 16px;
    border-radius: 8px;
  }
  .active {
    background-color: red;
  }
`
```

### Local component scope (inside particular react component function)

```jsx
import React from 'react'
import { View } from 'react-native'
import { css, styl } from 'startupjs'

export default function Card () {
  return <View styleName='root active'><Line /></View>
  // .root will be scoped only to this specific component
  styl`
    .root
      padding: 8px 16px
  `
}
function Line () {
  return <View styleName='root' />
  // .root will be scoped only to this specific component
  css`
    .root {
      margin-top: 16px;
      border-radius: 8px;
    }
  `
}
// you can use global- and local- scoped styles together
styl`
  .active
    background-color red
`
```

## License

MIT
