# startupjs cache

> Helpers for caching.

This is used to establish auto-caching (memoization) of styles and `model.at()`, `model.scope()` in React components context

## Usage

For internal use only.

By default the cache is enabled. To disable it everywhere do this:

```js
import { CACHE_ACTIVE } from '@startupjs/cache'

CACHE_ACTIVE.value = false
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
