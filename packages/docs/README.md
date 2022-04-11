# startupjs docs
> MDX Documentation generator

## Prerequisites

You must be using `@startupjs/app` for routing.

You can create a new application with the routing system using the `routing` template: `npx startupjs init myapp -t routing`

## Installation

```sh
yarn add @startupjs/docs
```

## Requirements

```
react: *
react-native: *
startupjs: *
```

## Usage

1. Create the `docs/` folder in your project root.

2. Create `docs/index.js` file with the following content:
  ```js
  import docs from '@startupjs/docs'
  export default docs({
    typography: {
      type: 'mdx',
      // different titles for mdx documentation in English and Russian
      title: {
        en: 'Typography',
        ru: 'Типографика'
      },
      // different components to display for English and Russian documentation
      component: {
        en: require('../components/typography/Typography.en.mdx').default,
        ru: require('../components/typography/Typography.ru.mdx').default
      }
    },
    cssGuide: {
      type: 'mdx',
      // the same title for both English and Russian mdx documentation
      title: 'Typography',
      // the same component to display for English and Russian documentation
      component: require('../components/typography/Typography.en.mdx').default
    },
    // docs in collapse
    // items have the same api as mdx docs
    components: {
      type: 'collapse',
      title: {
        en: 'Components',
        ru: 'Компоненты'
      },
      items: {
        Button: {
          type: 'mdx',
          title: {
            en: 'Button',
            ru: 'Кнопка'
          }
          component: {
            en: require('../components/Button/Button.en.mdx').default,
            ru: require('../components/Button/Button.ru.mdx').default
          }
        },
        Card: {
          type: 'mdx',
          title: 'Card',
          component: require('../components/Card/Card.en.mdx').default
        }
      }
    }
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
