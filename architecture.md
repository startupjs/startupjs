# StartupJS Architecture

StartupJS is an integration framework for building Expo/React Native/web apps
with Teamplay data, CSSX styling, StartupJS UI, server middleware, plugin
discovery, Babel transforms, Metro configuration, and project tooling.

This document describes the framework repository. For normal app-level coding
conventions and E2E testing practice, agents must read the discoverable
`startupjs` skill with:

```sh
npx startupjs skills
```

The command prints the installed skill path. Read its `SKILL.md`, then read the
referenced `references/AGENTS.md` and `references/E2E_GUIDE.md`.

The `libraries/` workspace is legacy, not maintained, and intentionally ignored
by this architecture.

## Repository Shape

The maintained framework lives under `core/`.

- `core/startupjs`: public facade package.
- `core/registry`: plugin registry and startupjs config runtime.
- `core/babel-preset-startupjs`: Babel preset used by apps and packages.
- `core/bundler`: Metro and bundler integration.
- `core/cli`: StartupJS command line.
- `core/server`: server runtime and middleware.
- `core/skills`: agent/user skills, especially the `startupjs` app guide.
- `core/auth`, `core/hooks`, `core/utils`, `core/isomorphic-helpers`,
  `core/worker`, and `core/router`: focused packages used by the facade or
  exported as standalone framework packages.
- `core/babel-plugin-*` and `core/babel-plugin-ts-to-json-schema`: standalone
  Babel plugins composed by the main preset.
- `core/create-startupjs` and `core/patches`: project scaffolding and install
  support.

`docker/`, `expoapp/`, `testapp/`, and `docs/` are integration and
documentation surfaces used for validation.

## Public Facade

`core/startupjs` is what end projects import:

- Teamplay exports such as `$`, `observer`, `useSub`, `sub`, and signal helpers.
- CSSX exports such as `css`, `styl`, `pug`, `CssxProvider`, `useTheme`, and
  theme entrypoints.
- StartupJS hooks and utilities.
- Provider and router compatibility helpers.
- `startupjs/babel`, `startupjs/metro-config`, `startupjs/themes/*`, and other
  package subpath exports.

`StartupjsProvider` is the root React provider. It wraps `CssxProvider` and then
renders plugin-provided root hooks:

```js
<CssxProvider style={style} theme={theme}>
  <MODULE.RenderNestedHook name='renderRoot' ... />
</CssxProvider>
```

This is how StartupJS UI injects `UiProvider`, and how other plugins can add
root-level behavior without each app manually composing every provider.

## Plugin System

The plugin system is owned by `@startupjs/registry`.

Key concepts:

- Packages expose StartupJS plugins through package exports.
- Apps can also define `startupjs.config.*`.
- The Babel plugin scans dependency metadata and startupjs config files.
- Runtime registry objects know which plugins/modules are enabled and ordered.
- Hooks such as `renderRoot`, `renderRouter`, `customIcons`, and
  `customInputs` allow packages to contribute behavior.
- `MODULE.dynamicPlugins()` renders hooks that can be collected from all active
  plugins.

Plugin records are environment-aware. The eliminator strips server/build/client
branches that do not belong in the current build.

## Babel Pipeline

Apps use `startupjs/babel` as the final Babel preset. The preset intentionally
centralizes framework transforms so apps do not need to understand every
underlying package.

The main transform order is:

1. Parse JSX/TypeScript syntax as needed.
2. Optional TS docgen schema extraction.
3. Transform React Pug to JSX with `styleName` class shorthand.
4. Compile inline CSSX `css`/`styl` templates.
5. Rewrite CSSX `styleName`, `part`, helper calls, and imported style files.
6. Auto-load StartupJS plugins.
7. Run Teamplay Babel transforms.
8. Run eliminator to remove wrong-environment config and model code.
9. Optimize StartupJS UI imports for tree-shaking.
10. Run debug and i18n extraction transforms.

Important options:

- `transformPug`: controls Pug transformation.
- `transformCss`: controls CSSX transformation.
- `compileCssImports`: controls whether imported CSSX files compile in Babel.
  On Metro it defaults to `['cssx.css']` so Expo can keep ordinary `.css`.
- `cssFileExtensions`: style import extensions considered by the CSSX plugin.
- `envs`: active environments for eliminator.
- `clientOnly`: ensures client bundles do not include server-only model code.

The preset is integration-sensitive. When changing it, validate in an actual
Expo/Metro app in addition to unit tests.

Server/plugin config files can also be transformed through the server preset
entrypoint, `babel-preset-startupjs/server`, via the bundler server loader.
This path keeps only server-relevant plugin/config environments and must stay in
sync with the main preset's config ecosystem rules.

## Metro And Bundler Integration

`startupjs/metro-config` wraps Expo or React Native Metro defaults.

It adds:

- StartupJS Babel transformer wrapper.
- `require.context` support for plugin discovery.
- SVG/MD/MDX/source extension handling.
- Optional CSSX file transformation by Metro.
- Default Stylus handling for legacy `.styl` files.
- Server middleware during development when enabled.
- Watch folders for linked packages referenced through Yarn `portal:`
  resolutions in monorepos.

Current style-file defaults:

- CSSX CSS files are not transformed by Metro by default
  (`transformCssFiles: false`) because `.cssx.css` can compile in Babel and
  Expo should keep its normal CSS pipeline.
- Stylus files are transformed by Metro by default
  (`transformStylFiles: true`) because Expo does not own `.styl`.
- Configurable extension lists let projects opt into different behavior.

## Server Runtime

`core/server` owns server-side StartupJS behavior:

- Sharedb/Teamplay server setup.
- Express/connect middleware.
- SSR/rendering helpers where applicable.
- Redis/Mongo integration.
- StartupJS config loading for server environments.

Client builds should never retain server-only secrets or server branches.
Changes to server config loading often require corresponding Babel eliminator
validation.

## CLI

`core/cli` provides commands used by projects and this repo:

- `startupjs check`: Pug-aware type checking through CSSX/react-pug tooling plus
  StartupJS generated type setup.
- `startupjs build`: production build helpers.
- `startupjs postinstall`: package setup.
- `startupjs skills`: lists discoverable skills such as the StartupJS app guide.
- Production server/worker helpers.

The CLI is also the bridge between repo-level maintenance and agent/user
guidance. If app-level rules change, update `core/skills/startupjs` and verify
`npx startupjs skills`.

## CSSX Integration

StartupJS does not implement its own styling language. CSSX owns:

- `css`/`styl` templates.
- `styleName` and `part` compilation.
- Runtime CSS variables and provider styles.
- Themes and dark-mode selection.
- Custom media and breakpoint aliases.
- Runtime CSS compilation.

StartupJS forwards `style` and `theme` from `StartupjsProvider` to
`CssxProvider`. StartupJS UI consumes this by layering its default provider
styles and plugin-provided overrides.

When debugging styling issues in apps:

1. Check whether Babel compiled CSSX syntax.
2. Check whether Metro is transforming or ignoring the expected style
   extensions.
3. Check whether `StartupjsProvider` receives the expected `style` and `theme`.
4. Check CSSX itself for resolver/runtime bugs.

## StartupJS UI Integration

StartupJS UI is a separate repo, but StartupJS is the integration point:

- Apps import `startupjs-ui`.
- Its `plugin.js` contributes a StartupJS plugin.
- `StartupjsProvider` renders the plugin's `renderRoot` hook.
- The hook wraps the app in `UiProvider`.
- `UiProvider` layers CSSX theme styles, portals, toasts, dialogs, custom icons,
  and custom inputs.

This design means normal apps do not manually mount `UiProvider`; they mount
`StartupjsProvider`.

## Generated And Compatibility Surfaces

StartupJS has several compatibility exports because many apps import old
subpaths. Prefer improving the modern facade, but do not break old subpaths
without an explicit migration.

Generated files and registry artifacts are part of the plugin and type-checking
story. If a change affects generated type entries or virtual config files,
validate both runtime behavior and `npx startupjs check`.

## Validation Strategy

Use focused tests for package-local behavior, then integration smoke tests for
cross-cutting changes.

- Babel/preset: transform fixtures and a real app compile.
- Metro: run an Expo dev server with cleared Metro cache when extensions or
  resolver behavior change.
- Provider/plugin: smoke a StartupJS app with StartupJS UI installed.
- CLI/check: run `npx startupjs check`.
- Skills: run `npx startupjs skills`.
- Server: run relevant server middleware or production helper tests.

Because StartupJS is mostly glue, many bugs only appear when multiple packages
are wired together. Prefer validating in a real app after changing Babel,
Metro, provider, or plugin behavior.

## Maintenance Rules

- Keep `startupjs/babel` as the single high-level preset for apps.
- Keep `startupjs/metro-config` close to Expo defaults and add only the minimum
  StartupJS behavior needed.
- Keep CSS behavior in CSSX, not in StartupJS.
- Keep component library behavior in StartupJS UI, not in StartupJS.
- Keep app-level agent instructions in `core/skills/startupjs`.
- Ignore `libraries/` unless the task is explicitly removing or archiving it.
- Document public behavior changes in the appropriate package docs and this
  architecture file.
