# eslint-plugin-startupjs

ESLint plugin with StartupJS-specific rules

## Installation

If you are in StartupJS project and using `eslint-config-startupjs` then you don't need to install anything.
It's already built in into that config.

## Manual installation

```sh
yarn add -D eslint eslint-plugin-startupjs
```

Add `startupjs` plugin in `.eslintrc.json`, disable default `no-unreachable` rule and enable all startupjs rules:

```json
{
  "plugins": [
    // ...
    "startupjs"
  ],
  "rules": {
    // ...
    "no-unreachable": "off",
    "startupjs/no-unreachable": "error"
  }
}
```

## Rules

### `startupjs/no-unreachable`

This is a copy of the `no-unreachable` rule from ESLint core, but with `styl` template literals being ignored.

ref: https://github.com/eslint/eslint/blob/main/lib/rules/no-unreachable.js

(a single new block of code is marked with a comment `// [startupjs]`)

## License

MIT
