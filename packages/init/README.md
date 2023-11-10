# startupjs init

> Init sharedb connection on client web, native or server side

## Installation

```sh
yarn add @startupjs/init
```

## Requirements

```
axios: *
```

## Usage

**IMPORTANT:**

1. This module has to be compiled since it uses `@env` import which is setup in `@startupjs/bundler`
2. Put this import on the highest possible level, before importing the `startupjs` first time.

```js
import '@startupjs/init'
```

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
