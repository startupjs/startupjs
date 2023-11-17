# @startupjs/babel-plugin-startupjs-debug

Additional transformations for development and debugging

## Usage

For internal usage only.

### Options

```js
// defaults
{
  fixObserverHotReloading: true,
  addFilenamesToObserver: true
}
```

## Example

fix hot reloading of observer() and add filename

```jsx
import { observer } from 'startupjs'

export default observer(function Main ({ title }) {
  return <span>Hello</span>
}, { forwardRef: true, suspenseProps: { loader: <span>Loading</span> } })
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import { observer } from "startupjs";
export default observer.__wrapObserverMeta(
  observer.__makeObserver(
    function Main({ title }) {
      return <span>Hello</span>;
    },
    {
      forwardRef: true,
      suspenseProps: {
        loader: <span>Loading</span>,
      },
      filename: "/ws/dummy-project/component.js",
    }
  )
);
```

## License

MIT
