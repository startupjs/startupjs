# Agent Guide

Read this first, then read `architecture.md` for the detailed system map.

StartupJS is the framework layer that combines Expo, Expo Router, Teamplay,
CSSX, StartupJS UI plugins, Babel transforms, Metro configuration, server
middleware, and project tooling. This repository is for maintaining the
framework itself. It is not the best place to learn normal app-level coding
patterns.

## Required App-Level Context

Before writing user-facing StartupJS app code or E2E tests, run:

```sh
npx startupjs skills
```

Then read the `startupjs` skill, especially:

- `AGENTS.md`: how StartupJS apps should be written.
- `E2E_GUIDE.md`: how StartupJS end-project E2E tests should be structured.

The command prints the installed skill path. Read that skill's `SKILL.md`, then
read the referenced files under its `references/` folder.

Do not duplicate that guidance here. This repo's `AGENTS.md` and
`architecture.md` focus on framework internals.

## Important Repository Rule

Ignore `libraries/`. These packages are legacy, not working, and not maintained
going forward. They remain in the workspace for historical reasons and should
not drive architecture, tests, docs, or migrations.

## Start Here

1. Read `architecture.md`.
2. Read the package map below and identify the smallest package boundary for
   your change.
3. For app-level behavior, also read the `startupjs` skill through
   `npx startupjs skills`.
4. Prefer current source over old READMEs when they disagree.

## Package Map

- `core/startupjs/`: public framework facade and provider exports. This package
  re-exports CSSX, Teamplay, router helpers, hooks, themes, and compatibility
  entrypoints.
- `core/registry/`: plugin/module registry, `createPlugin()`,
  `createRegistry()`, dynamic hooks, startupjs config loading, and generated
  virtual files.
- `core/babel-preset-startupjs/`: main Babel preset. It runs Pug, CSSX, plugin
  auto-loading, Teamplay transforms, eliminator, StartupJS import optimizer,
  debug, i18n, and optional docgen transforms.
- `core/bundler/`: Metro config, transformer wrapper, style-file handling,
  server middleware integration, SVG/MD/MDX support, and linked package
  watch-folder handling.
- `core/cli/`: CLI commands such as `check`, `build`, `postinstall`, `skills`,
  and production helpers.
- `core/server/`: server-side middleware, rendering, Teamplay server wiring,
  Redis/Mongo integration, and HTTP entrypoints.
- `core/router/`: standalone `@startupjs/router` package used by apps that need
  StartupJS router helpers.
- `core/auth/`, `core/hooks/`, `core/utils/`, `core/isomorphic-helpers/`,
  `core/worker/`: focused framework packages used by the facade or app
  integrations.
- `core/babel-plugin-*`, `core/babel-plugin-ts-to-json-schema/`: standalone
  Babel plugins composed by the preset.
- `core/create-startupjs/` and `core/patches/`: project scaffolding and install
  support.
- `core/skills/`: installable/discoverable skills used by agents and users.
- `docker/`, `expoapp/`, `testapp/`, `docs/`: integration apps and docs.

## Core Contracts

- `StartupjsProvider` wraps `CssxProvider` and forwards `style` and `theme`.
- StartupJS plugins are discovered from dependency `package.json` exports and
  `startupjs.config.*` files, then loaded through `@startupjs/registry`.
- Plugin hooks such as `renderRoot` let packages like StartupJS UI inject
  providers into every app.
- `startupjs/babel` must run as the last Babel preset in end projects.
- The Babel preset must avoid leaking server/build-only config to clients.
  Client builds use eliminator envs such as `features`, `isomorphic`, and
  `client`.
- CSSX is the only style compiler. StartupJS configures when CSSX style imports
  are compiled by Babel and when legacy Stylus files are passed to Metro.
- `startupjs/metro-config` should preserve Expo defaults while adding
  StartupJS features.
- `core/skills/startupjs` is the source of truth for app-level agent guidance.

## Commands

Install dependencies:

```sh
yarn install
```

Run the standard framework checks:

```sh
yarn check
```

Run docs:

```sh
yarn docs
```

Build the Expo integration app:

```sh
yarn build
```

There is no root `yarn test` script. Use package-local tests when a package has
them, and prefer an Expo app smoke test for Babel, Metro, provider, or plugin
changes.

Run the skills command locally:

```sh
npx startupjs skills
```

## Change Guidance

- Treat `AGENTS.md` and `architecture.md` as living onboarding docs. If your
  change alters package boundaries, public APIs, build/runtime flow, commands,
  testing expectations, or maintenance rules, update these files in the same
  change before handing work back.
- For provider/plugin root behavior, start with `core/startupjs` and
  `core/registry`.
- For transform ordering, file compilation, Pug, CSSX, plugin loading, or
  env trimming, start with `core/babel-preset-startupjs`.
- For server/plugin config transformation, also check
  `core/babel-preset-startupjs/server` and the bundler server loader.
- For Expo/Metro behavior, style-file extension handling, watch folders, or
  dev server middleware, start with `core/bundler`.
- For app-level type checking, inspect `core/cli/commands/check.js` and the
  CSSX checker it delegates to.
- For agent/user guidance, update `core/skills/startupjs` and avoid copying the
  same content into this repo-level guide.
- For framework public API changes, update `core/startupjs`, tests/docs, and
  `architecture.md`.
- Do not spend time modernizing `libraries/`; remove references only when it is
  part of deliberate cleanup.
- During cross-repo development, temporary `//resolutions` in `package.json`
  are acceptable locally, but do not publish or merge active dev-only
  resolutions unless that is explicitly intended.

## Validation

Use the narrowest checks that cover your change:

- Babel changes: preset tests plus an end-project compile smoke test.
- Metro changes: run an Expo/Metro app with cache cleared when relevant.
- Provider/plugin changes: smoke an app using `StartupjsProvider` and, when
  relevant, StartupJS UI.
- CLI/check changes: run `npx startupjs check`.
- Skill changes: run `npx startupjs skills` and verify the expected skill is
  discoverable.

When in doubt, validate in a real StartupJS Expo app because the framework is
primarily an integration layer.
