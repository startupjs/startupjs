# StartupJS Plugin Runtime

StartupJS plugins are discovered from package `exports`. A plugin export is any exact export named `./plugin` or ending with `.plugin`, for example:

```json
{
  "exports": {
    "./plugin": {
      "types": "./plugin.d.ts",
      "default": "./plugin.js"
    },
    "./files.plugin": {
      "types": "./files.plugin.d.ts",
      "default": "./files.plugin.js"
    }
  }
}
```

Runtime code imports the `default` target. Type generation imports the same public plugin specifier and TypeScript resolves the `types` target.

## Basic Plugin Shape

```js
import { createPlugin } from 'startupjs/registry'

export default createPlugin({
  name: 'files',
  enabled: true,
  order: 'system ui',
  isomorphic: options => ({
    models: models => ({
      ...models
    })
  }),
  server: options => ({
    serverRoutes: expressApp => {}
  }),
  client: options => ({})
})
```

`name` is the key used in `startupjs.config.js`:

```js
export default {
  plugins: {
    files: {
      isomorphic: {}
    }
  }
}
```

For automatic model typing, only named plugins for the root `startupjs` module are currently supported. Do not depend on computed plugin keys such as `[plugin]` when the type surface needs options.

## Hooks

The main hook for model typing is `isomorphic().models`.

Use it to return a model manifest:

```js
models: models => ({
  ...models,
  files: {
    default: FilesModel,
    schema,
    ...models.files
  },
  'files.*': {
    default: FileModel,
    ...models['files.*']
  }
})
```

Common patterns:

- New collection: add `collectionName` and `collectionName.*` entries.
- Schema mixin: merge additional fields into the collection `schema`.
- Access rules: define `access` for plugin-owned public collections. Use `accessControl(rules, { force: true })` for sensitive or server-managed collections.
- Method mixin: mutate or replace a model class prototype for matching model paths.
- Default model fallback: install plugin models only if the app has not provided its own model.

The `.d.ts` file must mirror the public signal/model surface installed by the runtime hook.
