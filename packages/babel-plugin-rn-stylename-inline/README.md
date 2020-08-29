# @startupjs/babel-plugin-rn-stylename-inline

Adds support for in-JS template strings `css\`\`` and `styl\`\``
for CSS styles for react-native.

Must be used together with `@startupjs/babel-plugin-rn-stylename` library.

## Options

`platform` -- what platform the compilation is on. For example, `web` or `ios` or `android`.

## Example

### Global file usage

```jsx
import React from 'react'
import { View } from 'react-native'

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

↓ ↓ ↓ ↓ ↓ ↓

```jsx
TBD
```

### Local component usage

```jsx
import React from 'react'
import { View } from 'react-native'

export default function Card () {
  return <View styleName='root active'><Line /></View>

  // .root will be scoped only to this specific component
  css`
    .root {
      padding: 8px 16px;
    }
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
css`
  .active {
    background-color: red;
  }
`
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
TBD
```

## Licence

MIT
