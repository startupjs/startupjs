# @startupjs/babel-plugin-eliminator

Cut out specific named exports or do the opposite -- only keep the ones you specify

## Install

```bash
npm i @startupjs/babel-plugin-eliminator
```

## Usage

### Removing specific named exports

#### Options:

```json
{
  "plugins": [
    ["@startupjs/babel-plugin-eliminator", {"removeExports": ["foo", "default"]}]
  ]
}
```

#### Input:

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

#### Output:

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

#### Options:

```json
{
  "plugins": [
    ["@startupjs/babel-plugin-eliminator", {"keepExports": ["foo", "default"]}]
  ]
}
```

#### Input:

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

#### Output:

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

### Removing Keys within Objects of Magic Function Calls

This feature in the `@startupjs/babel-plugin-eliminator` allows selective retention or removal of keys within objects passed to specific functions. It's particularly useful for customizing the shape of large objects or configurations passed to 'magic' functions.

To utilize this feature, configure the `keepObjectKeysOfFunction` option in your Babel plugin settings. This allows you to specify the functions and the particular keys within their object arguments that you want to keep.

#### Options:

```json
{
  "plugins": [
    [
      "@startupjs/babel-plugin-eliminator",
      {
        "keepObjectKeysOfFunction": {
          "createProject": {
            "magicImports": ["startupjs/registry", "@startupjs/registry"],
            "targetObjectJsonPath": "$.plugins.*",
            "ensureOnlyKeys": ["client", "isomorphic", "server", "build"],
            "keepKeys": ["client", "isomorphic"]
          }
        }
      }
    ]
  ]
}
```

In this configuration:
- `createProject` is the function where object key manipulation occurs.
- `magicImports` specifies the module imports that identify `createProject` as a magic function.
- `targetObjectJsonPath` (optional) is the JSON path to the target object path within the function's first argument. By default the top-level object itself is used.
- `keepKeys` specifies which keys in the object should be retained in the output.
- `ensureOnlyKeys` (optional) lists all possible keys in the object, providing a way to validate the object structure.

#### Input

```js
import { createProject } from 'startupjs/registry'

// ...other imports...

export default createProject({
  plugins: {
    'serve-static-promo': {
      client: {
        redirectUrl: '/promo',
        // ...other client properties...
      },
      server: {
        // ...server properties...
      },
      build: {
        // ...build properties...
      },
      isomorphic: {
        // ...isomorphic properties...
      }
    },
    permissions: {
      client: {
        // ...permissions client properties...
      },
      server: {
        // ...permissions server properties...
      },
      build: {
        // ...permissions build properties...
      },
      isomorphic: {
        // ...permissions isomorphic properties...
      }
    }
  }
})
```

#### Output

```js
import { createProject } from "startupjs/registry";

// ...other imports...

export default createProject({
  plugins: {
    "serve-static-promo": {
      client: {
        redirectUrl: "/promo",
        // ...retained client properties...
      },
      isomorphic: {
        // ...retained isomorphic properties...
      }
    },
    permissions: {
      client: {
        // ...retained permissions client properties...
      },
      isomorphic: {
        // ...retained permissions isomorphic properties...
      }
    }
  }
});
```

## Options

```js
type PluginOpts = {
  /** Removing specific named exports (use 'default' for default export) */
  removeExports?: string[],
  /** Keep only these exports (use 'default' for default export) */
  keepExports?: string[],
  /**
   * Specify keys within objects of specific function calls to be kept.
   * Applies to the objects passed as arguments to the specified functions.
   */
  keepObjectKeysOfFunction?: {
    [functionName: string]: {
      /** Array of module import paths which identify the function as a 'magic' function */
      magicImports: string[],
      /** JSON path to the object within the function where the keys are located */
      targetObjectJsonPath?: string,
      /** List of all possible keys within the object (for validation purposes) */
      ensureOnlyKeys?: string[],
      /** Array of keys that should be kept in the final output */
      keepKeys: string[]
    }
  },
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
5. add feature to remove object keys within magic function calls

## License

MIT
