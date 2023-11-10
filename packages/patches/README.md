# startupjs patches

> patches for libraries used by startupjs. Required for proper StartupJS functioning

## Installation

It's included into the core `startupjs` package. You don't need to install it on your own.

## Usage

Add the following `postinstall` script to you `package.json`:

```json
"scripts": {
  "postinstall": "startupjs patch-package"
}
```

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
