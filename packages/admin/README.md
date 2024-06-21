# Admin Dashboard

## Installation

1. Install `@startupjs/router` and `@startupjs/ui`:

    ```
    npx startupjs install --router --ui
    ```

2. Install `@startupjs/admin`.

    When using `yarn`:

    ```
    yarn add @startupjs/admin
    ```

3. Add admin dashboard under `/admin` to your app's router.

    If you are using Expo router, add the following files:

    `/app/admin/index.js`:

    ```js
    import { getRouter } from '@startupjs/router'
    import { routes } from '@startupjs/admin'

    export default getRouter(routes)
    ```

    `/app/admin/[...all].js`:

    ```js
    export { default } from './index.js'
    ```

## Plugins API

Create a plugin file named `plugin.js` or `myAdminPlugin.plugin.js`:

```js
import { createPlugin } from 'startupjs/registry'

export default createPlugin({
  name: 'my-admin-plugin',
  for: 'admin',
  enabled: true,
  client: (pluginOptions) => ({
    // client hooks implementation
  })
})
```

Add this file to `exports` of `package.json` under the `plugin` or `myAdminPlugin.plugin` name to load it automatically into your app:

```json
"exports": {
  "plugin": "./plugin.js"
}
```

To pass options to your plugin (if your plugin will have any options) in the app, specify them in `startupjs.config.js`:

```js
export default {
  plugins: {
    'admin/my-admin-plugin': {
      client: {
        // arbitrary options for your plugin
        color: 'green',
        itemsLimit: 20
      }
    }
  }
}
```

## Hooks / `client`

### `routes`

Routes to add to the admin dashboard.

**Note:** paths must be relative (do NOT prepend `/admin`)

```jsx
routes: () => [
  { path: 'users', element: <UsersPage /> }
]
```

### `menuItems`

Menu items to add to the sidebar.

**Note:** paths must be relative (do NOT prepend `/admin`, use the same path you used in `routes` hook)

```jsx
menuItems: () => [
  { name: 'Users', to: 'users' }
]
```

### `renderHomeBlocks`

Blocks to render on the home page of admin dashboard.

```jsx
renderHomeBlocks: () => (
  <Card>
    <H6>Users</H6>
    <Span>Registered users: {$usersCount.get()}</Span>
  </Card>
)
```

### `renderTopbarRight`

Render extra items to the right side of the topbar (always visible).

```jsx
renderTopbarRight: () => (
  <Avatar size='s'>Admin User</Avatar>
)
```
