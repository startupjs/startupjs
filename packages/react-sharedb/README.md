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

You don't need to install anything if you are in a StartupJS project.

### using `react-sharedb` in a pure React project

If you want to use `react-sharedb` separately from StartupJS in a pure React project, refer to the following [issue](https://github.com/startupjs/startupjs/issues/529). You'll also need to manually setup the `sharedb` on your server following its [readme](https://github.com/share/sharedb) instructions. Make sure you use the same `sharedb` and `racer` versions as used in `react-sharedb`, you can check for duplicates using `yarn list sharedb racer`.


## Requirements

```
react: 16.9 - 17
```

## Usage with Hooks

[Hooks syntax documentation](/packages/react-sharedb-hooks)

## Usage with Classes

[Classes syntax documentation](/packages/react-sharedb-classes)

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
