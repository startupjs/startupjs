---
name: create-startupjs-plugin
description: Use when authoring or updating StartupJS plugins, especially plugins with a models hook that adds TeamPlay collections, schemas, model methods, or typed model mixins through plugin declaration files.
---

# Create StartupJS Plugin

Use this skill when writing or reviewing a StartupJS plugin. For plugins that use the `models` hook, use it to create or update the plugin `.d.ts` file so app projects get automatic TeamPlay types.

## References

- Read [references/plugin-runtime.md](references/plugin-runtime.md) for the StartupJS registry, module, and plugin basics.
- Read [references/model-types.md](references/model-types.md) before writing plugin model typings.
- If StartupJS app conventions are not already in context from the project `AGENTS.md`, run `npx startupjs skills` and inspect the `startupjs` skill path from that output. Read its `references/AGENTS.md` when you need the full app-authoring guide.

## Workflow

1. Inspect the runtime plugin export and identify its `name`, exported path, options, hooks, and whether it is a root `startupjs` plugin.
2. If the plugin has an `isomorphic().models` hook, map the runtime model changes exactly:
   - new top-level collections
   - new document model classes
   - schema fields mixed into existing collections
   - access rules for plugin-owned public collections
   - fields written to private root collections like `_session`
   - methods mixed into existing model paths
   - behavior that depends on `startupjs.config.js` feature flags
   - behavior that depends on `startupjs.config.js` plugin options
3. Add a declaration file next to the plugin runtime file, usually `plugin.d.ts` or `<name>.plugin.d.ts`.
4. Update the package export so the same plugin export has both runtime and types:

```json
"./plugin": {
  "types": "./plugin.d.ts",
  "default": "./plugin.js"
}
```

5. Validate from an app using the plugin:
   - run install if local package resolutions changed
   - run `npx startupjs check`
   - inspect generated `teamplay-env.d.ts` and confirm it imports the plugin export itself
   - add a small smoke type file when useful, including `@ts-expect-error` for one intentionally invalid use

## Typing Rules

- App authors should not import plugin types manually. StartupJS discovers typed plugin exports.
- The `.d.ts` file describes the runtime model surface; it does not run runtime code.
- Use `TeamplayPluginCollections` for plugin-provided collections.
- Use `TeamplayPluginPrivateCollections` for plugin-provided private root fields such as `_session.userId`.
- Use `TeamplayPluginSignalFields` for methods or fields mixed into existing model paths.
- For plugin-owned model classes in `.d.ts` files, prefer `export declare class Model extends Signal<T>` and use `typeof Model` in `CollectionSpec`.
- Use `TeamplayFeature<'featureName'>` only when the type surface depends on static feature flags from `startupjs.config.js`.
- Use `TeamplayPluginOption<'pluginName'>` only when the type surface depends on static named options from `startupjs.config.js`.
- Keep declaration files generic and package-owned. Do not import app-local model files from a plugin declaration.
