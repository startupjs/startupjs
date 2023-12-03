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
    ["@startupjs/babel-plugin-eliminator", {"removeExports": ["foo", "default"]}]
  ]
}
```

Input:

```js
import usedByFoo from 'used-by-foo'
import usedByDefault from 'used-by-default'
import usedByBar from 'used-by-bar'

const varInFoo = 'var-in-foo'
const varInDefault = 'var-in-default'
const varInBar = 'var-in-bar'

export const foo = () => {
  return usedByFoo(varInFoo)
}

export default () => {
  return usedByDefault(varInDefault)
}

export function bar () {
  return usedByBar(varInBar)
}
```

Output:

```js
import usedByBar from 'used-by-bar'

const varInBar = 'var-in-bar'

export var foo = 1

export default 1

export function bar () {
  return usedByBar(varInBar)
}
```

### Keep only the specified exports

Options:

```json
{
  "plugins": [
    ["@startupjs/babel-plugin-eliminator", {"keepExports": ["foo", "default"]}]
  ]
}
```

Input:

```js
import usedByFoo from 'used-by-foo'
import usedByDefault from 'used-by-default'
import usedByBar from 'used-by-bar'

const varInFoo = 'var-in-foo'
const varInDefault = 'var-in-default'
const varInBar = 'var-in-bar'

export const foo = () => {
  return usedByFoo(varInFoo)
}

export default () => {
  return usedByDefault(varInDefault)
}

export function bar () {
  return usedByBar(varInBar)
}
```

Output:

```js
import usedByFoo from 'used-by-foo'
import usedByDefault from 'used-by-default'

const varInFoo = 'var-in-foo'
const varInDefault = 'var-in-default'

export const foo = () => {
  return usedByFoo(varInFoo)
}

export default () => {
  return usedByDefault(varInDefault)
}

export var bar = 1
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
