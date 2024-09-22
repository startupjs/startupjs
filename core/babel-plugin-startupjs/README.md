# @startupjs/babel-plugin-startupjs

Unwrap imports for tree shaking.

## Example

```jsx
export { Button, Span } from '@startupjs/ui'
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import Button from '@startupjs/ui/components/Button'
import Span from '@startupjs/ui/components/typography/Span'
```

## License

MIT
