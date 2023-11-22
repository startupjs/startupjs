# @startupjs/babel-plugin-eliminator

Cut out specific named exports or do the opposite -- only keep the ones you specify

## Install

```bash
npm i @startupjs/babel-plugin-eliminator
```

## Usage

### Removing specific named exports

Options:

```json
{
  "plugins": [
    ["@startupjs/babel-plugin-eliminator", {"removeExports": ["foo"]}]
  ]
}
```

Input:

```js
import pkg from 'some-pkg'

const someVariable = 'some-string'

export const foo = () => {
  return pkg(someVariable)
}
```

Output:

```js
export var foo = 1
```

## Options

```js
type PluginOpts = {
  /** Removing specific named exports (use 'default' for default export) */
  removeExports?: string[]
  /** Keep only these exports (use 'default' for default export) */
  keepExports?: string[]
  /** Called at the end of transpiling */
  done?: (state: PluginState) => void
}
```

## Credits

This plugin is a fork of [egoist/babel-plugin-eliminator](https://github.com/egoist/babel-plugin-eliminator) with the following changes:

1. refactor to pure JS
2. rename `namedExports` to `removeExports`
3. add an alternative `keepExports` option. If specified, only these one are gonna be kept and all other exports will be removed
4. handle `default` export

## License

MIT
