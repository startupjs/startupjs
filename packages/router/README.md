# @startupjs/router

Router based on `react-router` which lets you define programmatic routes.

It's compatible with expo-router and can be embedded into one of its subpaths in the file-system based routing.

## Usage inside expo-router

Lets say you want to add an `admin` section with all `/admin/*` paths to be handled by the `@startupjs/router` sub-router

1. Add `@startupjs/router`

    ```sh
    yarn add @startupjs/router
    ```

    (while startupjs with expo support is still in alpha you need to use `yarn add @startupjs/router@next`)

2. Create an escape hatch for all subpaths within a particular expo-router path to be handled by `@startupjs/router`.

    In `app` folder create `app/admin` folder, and inside it `index.js` and `[...all].js` to handle any `/admin` route.

    ```js
    // app/admin/index.js

    import { getRouter } from '@startupjs/router'
    import routes from '../../admin/routes' // this is the actual programmatic routes

    export default getRouter(routes)
    ```

    ```js
    // app/admin/[...all].js

    export { default } from './index.js'
    ```

3. In the root of your project create `admin` folder with programmatic routes defined in `routes.js`.

    ```
    admin/
      routes.js
      _layout.js
      index.js
      hello.js
    ```

    For layout routes use `Slot` component to indicate where the nested route has to go.

    ```js
    // admin/routes.js

    import { createElement as el } from 'react'
    import _layout from './_layout'
    import hello from './hello'
    import index from './index'

    export default [{
      path: '',
      element: el(_layout),
      children: [{
        path: '',
        element: el(index)
      }, {
        path: 'hello',
        element: el(hello)
      }]
    }]
    ```

    ```js
    // admin/_layout.js

    import React from 'react'
    import { observer } from 'startupjs'
    import { Slot } from '@startupjs/router'
    import { Span } from '@startupjs/ui'

    export default observer(function Layout () {
      return pug`
        Span Admin page
        Slot
      `
    })
    ```

    ```js
    // admin/index.js
    // url: '/admin'

    import React from 'react'
    import { observer } from 'startupjs'
    import { Span, Link, Button } from '@startupjs/ui'

    export default observer(function Layout () {
      return pug`
        Span Dashboard
        Link(href='./hello')
          Button Go to Hello
      `
    })
    ```

    ```js
    // admin/hello.js
    // url: '/admin/hello'

    import React from 'react'
    import { observer } from 'startupjs'
    import { Div, Span, Link, Button } from '@startupjs/ui'

    export default observer(function Layout () {
      return pug`
        Span Hello
        Div(gap row)
          Link(href='..')
        Button Go to Dashboard
          Link(href='/')
            Button Home
      `
    })
    ```

## License

MIT
