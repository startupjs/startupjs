---
name: startupjs
description: Use when building or modifying StartupJS applications, including Expo Router routes, pug templates, startupjs-ui components, TeamPlay signals, subscriptions, models, schemas, access rules, aggregations, and app validation.
---

# StartupJS

StartupJS is a full-stack React Native/Web framework built on Expo, Expo Router, startupjs-ui, and TeamPlay signals.

Use this skill when working inside a StartupJS app or when creating app code that should follow StartupJS conventions.

## Full Guide

Read [references/AGENTS.md](references/AGENTS.md) before making non-trivial StartupJS app changes. This file is the canonical agent guide copied into newly generated StartupJS projects as root `AGENTS.md`.

## Core Rules

- Write app code in TypeScript unless the framework specifically requires JavaScript, such as `startupjs.config.js`.
- Use pug templates through `pug` from `startupjs`; do not convert StartupJS component code to JSX unless the project already uses JSX in that file.
- Wrap StartupJS components in `observer()` by default.
- Import framework primitives from `startupjs`: `$`, `observer`, `useSub`, `sub`, `pug`, `Signal`, `aggregation`, and related APIs.
- Import UI primitives from `startupjs-ui` before reaching for `react-native` components.
- Subscribe to database data with `useSub()` or `sub()` before reading it. Private collections such as `$._session` do not need subscriptions.
- Pass signals to child components when the child should read or write the value; call `.get()` as late as practical.
- Put models in `models/` using collection `index.ts`, document `[id].ts`, `schema.ts`, `access.ts`, and `_aggregation.ts` files.
- Prefer normal Mongo-style queries in `useSub()` for simple filtering; use aggregations only when query syntax is not enough.
- Validate app changes with `npx startupjs check` and lint/tests expected by the project.
