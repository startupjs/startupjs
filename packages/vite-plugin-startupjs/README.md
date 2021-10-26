# @startupjs/vite-plugin-startupjs

> Compile web client in development using vite

## Installation

1. Install vite and this plugin

    ```
    yarn add vite @startupjs/vite-plugin-startupjs
    ```

2. Add `vite.config.mjs` to the root of your project:

    ```js
    import { defineConfig } from 'vite'
    import startupjsPlugin from '@startupjs/vite-plugin-startupjs'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        startupjsPlugin()
      ]
    })
    ```

## Usage

Run server and web compilation together:

```
yarn start -v
```

If you want to run server and web compilation separately:

1. Run server with `-v` option:

    ```
    yarn server -v
    ```

2. Run web with `-v` option:

    ```
    yarn web -v
    ```

## **IMPORTANT** things to follow when writing code:

1. You **CAN NOT** use `.js`/`.ts` for files which have `JSX` (or use Pug). You **MUST** name them `.jsx`/`.tsx`.
