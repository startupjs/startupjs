# Plugin Model Types

StartupJS plugins can add TeamPlay models through the `models` hook. When a plugin adds a new collection, adds document methods to existing collections, or mixes schema fields into a project collection, the plugin should also publish a declaration file for the plugin export.

The typed plugin export is discovered automatically by StartupJS and imported into the generated `teamplay-env.d.ts`. App authors do not need to import anything manually.

## Typed Export

Publish the runtime plugin with a `types` condition on the same export:

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

StartupJS scans exact package exports named `./plugin` or ending in `.plugin`. If that export has a `types` condition, the plugin import itself is added to the TeamPlay type environment. Runtime code still imports the same export and receives the `default` target.

For now, only plugins for the root `startupjs` module are supported by this automatic model typing flow.

## App Configuration

App authors configure plugins normally in `startupjs.config.js`:

```js
export default {
  plugins: {
    permissions: {
      isomorphic: {
        entities: ['teams']
      }
    }
  }
}
```

The type generator reads static feature flags and named plugin options from this object. Use plain object keys such as `permissions`; computed keys such as `[permissionsPlugin]` are not part of this flow.

Static object, array, string, number, boolean, `null`, and `undefined` values are converted into TypeScript literal types. Dynamic expressions are treated as `unknown`.

## Adding A Collection

If a plugin adds a collection through the `models` hook, augment `TeamplayPluginCollections` in the plugin declaration file:

```ts
import { Signal, type CollectionSpec } from 'startupjs'

export interface FileDoc {
  storageType: string
  mimeType: string
  createdAt: number
  updatedAt: number
}

declare class FilesModel extends Signal<FileDoc[]> {
  getUploadUrl(fileId?: string): string
}

declare class FileModel extends Signal<FileDoc> {
  getUrl(): string
}

declare module 'teamplay' {
  interface TeamplayPluginCollections {
    '@startupjs-ui/file-input/files': {
      files: CollectionSpec<FileDoc, typeof FilesModel, typeof FileModel>
    }
  }
}

export {}
```

Use a unique key inside `TeamplayPluginCollections`, usually the package name plus the feature name. The value is a normal collection map. After generation, app code can use `$.files`, `useSub($.files[id])`, and model methods without extra imports.

If the collection only exists for a feature flag, use `TeamplayFeature<'featureName'>`:

```ts
import { type CollectionSpec, type TeamplayFeature } from 'startupjs'

type OAuth2Collections = TeamplayFeature<'enableOAuth2'> extends true
  ? { users: CollectionSpec<UserDoc> }
  : {}

declare module 'teamplay' {
  interface TeamplayPluginCollections {
    '@startupjs/auth/oauth2': OAuth2Collections
  }
}
```

## Adding Private Collection Fields

Private root collections such as `_session` are value signals, not document collections. If a plugin writes fields to a private collection, augment `TeamplayPluginPrivateCollections`:

```ts
declare module 'teamplay' {
  interface TeamplayPluginPrivateCollections {
    '@startupjs/auth/session': {
      _session: {
        userId: string
        token?: string
      }
    }
  }
}
```

App code can then use `$._session.userId`, `$.session.userId`, or destructuring such as `const { $userId } = $.session`. Do not put private collections in `TeamplayPluginCollections`; that would describe a public collection with document ids and `.add()`.

## Adding Methods To Existing Collections

If a plugin mixes methods into project models, augment `TeamplayPluginSignalFields`. The keys are TeamPlay model paths such as `users.*` or `teams.*`.

```ts
import { type TeamplayPluginOption } from 'startupjs'

type Options = TeamplayPluginOption<'permissions'>

type ConfiguredEntities =
  Options extends { isomorphic: { entities: readonly (infer Entity extends string)[] } }
    ? Entity
    : never

type EntityPath = `${'users' | ConfiguredEntities}.*`

interface PermissionMethods {
  addRole(scopeModel: unknown, role: string): Promise<void>
  getRoles(scopeModel?: unknown): Promise<Record<string, boolean>>
}

type PermissionSignalFields = {
  [Path in EntityPath]: PermissionMethods
}

declare module 'teamplay' {
  interface TeamplayPluginSignalFields {
    '@startupjs/permissions/entities': PermissionSignalFields
  }
}

export {}
```

`TeamplayPluginOption<'permissions'>` resolves to the static options from `startupjs.config.js`. This lets plugin authors make generated methods depend on user configuration while keeping the app authoring experience automatic.

## Runtime And Type Shape

The runtime plugin remains responsible for returning the real model overrides from the `models` hook:

```js
export default createPlugin({
  name: 'files',
  isomorphic: () => ({
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
  })
})
```

Keep the runtime hook and the declaration file in sync. The declaration file does not run runtime code; it only describes the model surface that the plugin actually installs.

## Guidelines

- Keep plugin declarations declarative. Prefer module augmentation over project-specific imports.
- Put plugin-provided collections in `TeamplayPluginCollections`.
- Put plugin-provided private root fields in `TeamplayPluginPrivateCollections`.
- Put plugin-provided path methods or fields in `TeamplayPluginSignalFields`.
- Use `TeamplayFeature<'featureName'>` when the type surface depends on static `features` from `startupjs.config.js`.
- Use `TeamplayPluginOption<'pluginName'>` only when the type surface really depends on app configuration.
- Avoid asking app authors to import plugin declarations. If the package exports are correct, StartupJS discovers them automatically.
