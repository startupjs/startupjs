# startupjs react-sharedb

> Run `ShareDB` in `React`

## What it does

1. Brings real-time collaboration to React using [ShareDB](https://github.com/share/sharedb);
2. Uses [Racer](https://derbyjs.com/docs/derby-0.10/models) to add a `model`
   to your app to do any data manipulations;
3. The `model` acts as a global singleton state, so you can use it as a
   replacement for other state-management systems like `Redux` or `MobX`;
4. Makes the `render` reactive similar to how it's done in `MobX` --
   rerendering happens whenever any `model` data you used in `render`
   changes.

## Installation

It's recommended to just use `startupjs` package, since it proxies the API of `@startupjs/react-sharedb`.

```
yarn add startupjs
```

## Usage with Hooks

[Hooks syntax documentation](/packages/react-sharedb-hooks)

## Usage with Classes

[Classes syntax documentation](/packages/react-sharedb-classes)

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
