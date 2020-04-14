# startupjs docs
> MDX Documentation generator

## Prerequisites

You must be using `@startupjs/app` for routing.

You can create a new application with the routing system using the `routing` template: `npx startupjs init myapp -t routing`

## Installation

```sh
yarn add @startupjs/docs
```

## Usage

1. Create the `docs/` folder in your project root.

2. Create `docs/index.js` file with the following content:

    ```js
    import docs from '@startupjs/docs'
    export default docs({
      en: {
        // path to mdx documentation for Button component in English
        Button: require('../components/Button.en.mdx')
      },
      ru: {
        // path to mdx documentation for Button component in Russian
        Button: require('../components/Button.ru.mdx')
      },
      // if you want to provide a list of components to automatically
      // generate documentation to play with, specify them in
      // the `sandbox` option. It must be an object where the key
      // is component's name and value is the component itself.
      sandbox: require('../components')
    })
    ```

3. Add client-side `docs` app to your `Root/App.js` file:

    ```js
    import docs from '../docs'
    // ...
    <App
      apps={{ main, docs }}
      // ...
    />
    ```

4. Add server-side `docs` routes to your `server/index.js` file:

    ```js
    import getDocsRoutes from '@startupjs/docs/routes'
    // ...

    startupjsServer({
      getHead,
      appRoutes: [
        ...getMainRoutes(),
        ...getDocsRoutes()
      ]
    })

    // ...
    ```

## Licence

MIT
