# @startupjs/babel-plugin-import-to-react-lazy

Transforms exported default import to React.lazy dynamic import.

## Example

```jsx
/* @asyncImports */
export { default as PHome } from './PHome'
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import { lazy } from 'react'
export const PHome = lazy(() => import('./PHome'))
```

## Licence

MIT
