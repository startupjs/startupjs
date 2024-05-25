# startupjs mdx
> MDXProvider with a set of custom components for react-native support and syntax highlighting

## Installation

```sh
yarn add @startupjs/mdx
```

## Requirements

```
react: 16.9 - 17
```

## Usage

Wrap your `<App />` into the `MDXProvider`.
This will allow you to import and properly render the `mdx` component anywhere inside the `<App />`.

```js
import { MDXProvider } from '@startupjs/mdx'

<MDXProvider>
  <App />
</MDXProvider>
```

## Custom components

You can specify custom markdown components by providing the `components` prop:

```js
import { MDXProvider } from '@startupjs/mdx'

<MDXProvider components={{ h1: props => <Text style={ color: 'red' } {...props} /> }}>
  <App />
</MDXProvider>
```

For the full list of components, look [here](https://mdxjs.com/getting-started#table-of-components)

## License

MIT
