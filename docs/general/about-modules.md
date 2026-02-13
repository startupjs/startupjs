# Modules in Startupjs

We already know that Startupjs provides the ability to customize an application using plugins. And in most cases this will be sufficient. But what if our plugin contains functionality that we'd also like to customize? For example, we wrote a plugin for the Auth package. The Auth itself provides the ability to connect different authentication strategies (for example, Google, LinkedIn and others). In such a situation, we can create an auth module, which will already have its own plugins connected, each of which will implement its own strategy. For each module, we can create multiple plugins. The user will only need to install a package from Startupjs, for example, startupjs/auth-google (name given as an example), and this package will be automatically connected. There will be no need to configure anything additionally.

The entire concept of modules (like plugins) is essentially the concept of event emitters, where a module is our eventEmitter that emits events, where instead of the familiar emit, we have hook, and plugins are the on function for subscribing to events.
The only difference from a regular eventEmitter is that our eventEmitter returns data.

## Let's understand how to write your own module using the admin module as an example

The structure of our module looks like this:

The admin panel consists of a sidebar and content part. This is a common structure for projects. But the pages that will be available in the admin panel are individual for each project and their addition and customization in our example will be implemented through a separate 'schema' plugin, which will add several pages to our admin module and an 'admin-api' plugin, which will extend the API of the main Startupjs module by adding new endpoints that the new pages use.

```
    admin/
    │
    ├── client/
    │ ├── _layout.js
    │ ├── index.js
    │ └── routes.js
    │
    ├── index.js
    ├── module.js
    └── package.json
```

Initially, we should create a module. To do this, in the `module.js` file, which is located in the project root, we'll write the following code:

```js
  import { createModule } from 'startupjs/registry'

  export default createModule({
    // name - unique module name
    name: 'admin'
  })
```

Add information about this file to the `exports` section of the `package.json` file under the name `module.js` so it automatically loads into your application. If the module is in a separate folder, you need to account for the path:

```json
  "exports": {
    "./module": "./module.js"
  }
```

Modules and plugins interact closely with each other. Modules provide capabilities for adaptation and extending functionality using plugins, modules include hooks for interacting with plugins. These hooks allow custom plugins to implement additional functions by responding to specific events or actions within the module.

Let's look at one of such "hooks" using the `routes.js` file as an example

```js
    import { createElement as el } from 'react'
    import MODULE from '../module'
    import _layout from './_layout'
    import index from './index'

    export default [{
    path: '',
    element: el(_layout),
    children: [
        { path: '', element: el(index) },
        ...MODULE.hook('routes').flat()
    ]
    }]
```
To interact with plugins, we import MODULE from the file where we created it, and we get access to using the hook method on MODULE.

`import MODULE from '../module'`,

For simplicity of understanding, we perceive MODULE.hook('routes') as emit('routes').
As mentioned earlier, using MODULE.hook('routes') we get an array of routes that is described in the plugin. If we don't create a plugin, then we won't have the routes event and MODULE.hook('routes') will return nothing to us.

Let's create a 'schema' plugin:

```js
  export default createPlugin({
    name: 'schema',
    for: 'admin',
    enabled: true,
    client: () => ({
      routes: () => [
        { path: 'schema', element: <Page /> },
        { path: 'test-page', element: <TestPage /> }
      ],
      menuItems: () => [
        { to: 'schema', name: 'Schema', icon: faTable },
        { to: 'test-page', name: 'TestPage', icon: faTable }
      ]
    })
  })
```

In this example, we define a routes hook that is intended for integrating additional pages into the admin panel. When we connect the plugin, the module will be able to emit events described in the plugin. In our example, when we emit the routes event, the plugin provides an array of new pages that will be built into the administrative interface. The logic and content of these pages are developed and described directly inside the plugin, ensuring modularity and flexibility in extending the admin panel.

To "bind" a plugin to the required module, the for property of the plugin is used. This is described in more detail in the plugin documentation. But in short, you simply specify the module name for for. If for is not specified, then Startupjs itself will act as the module, as the root module.

After we've defined routes for the necessary pages, the next step is displaying them in the sidebar of the administrative interface. For this purpose, we use the menuItems event. When the admin module requests menu items, plugins can respond to this event and provide menu data, including links to new pages that were added through routes. This ensures dynamic integration of pages into the admin panel user interface.

In the `_layout.js` file, where we output menuItems, we'll add this code:

```js
  const menuItems = useMemo(() => [
    { name: 'Home', to: adminPath, icon: faTachometerAlt },
    ...MODULE.hook('menuItems').flat().map(item => ({
      ...item,
      to: item.to ? (adminPath + '/' + item.to) : undefined
    }))
  ], [adminPath])
```

From this example, we can see that we will always have a Home page, but if we connect the schema plugin, when we emit the menuItems event, MODULE.hook('menuItems') will return us an array of pages with paths described in the plugin.

If we need to add new API routes that were not initially registered in Startupjs, we can do this by creating another plugin. This plugin will be intended directly for extending the functionality of the base Startupjs module, and its description doesn't need to specify the for field, since it should be processed by Startupjs itself.

Thus, a plugin without the for field will be perceived as an extension of the base Startupjs module. Inside this plugin, we can use the server api hook to add new API routes that will be integrated with the main application. This will allow us to provide the necessary connection between new admin panel pages and corresponding API calls.

```js
    export const startupjsPlugin = createPlugin({
    name: 'admin-api',
    enabled: true,
    server: () => ({
        api: expressApp => {
          expressApp.get(`${BASE_URL}/files`, files)
          expressApp.get(`${BASE_URL}/file/:filename`, getFile)
        }
      })
    })
```

We can also write a plugin that outputs some JSX:

```js
  export default createPlugin({
    name: 'schema',
    for: 'admin',
    enabled: true,
    client: () => ({
      renderTopbarRight: () => (
        <Avatar size='s'>Admin User</Avatar>
        )
    })
  })
```

In cases where the admin module provides the ability to extend through client-side hooks, we can create a plugin that implements specific hooks with predefined names declared in the admin module. This will allow integrating custom JSX code into specific parts of the administrative interface.

For example, if the admin module declares a client-side renderTopbarRight hook, the plugin can implement this hook to add a custom component to the right part of the topbar. Inside the admin module JSX, this hook can be activated as follows:

The plugin must contain an implementation for the hook named renderTopbarRight so that its content can be correctly displayed in the admin panel. This allows developers to flexibly extend the functionality of the administrative panel by adding new interface elements or functionality without changing the source code of the admin module.

```js
return pug`
    SmartSidebar.sidebar($open=$sidebarOpened defaultOpen renderContent=renderSidebar)
    Div.topbar(row vAlign='center')
        Div.left(row gap vAlign='center')
        Button(
            variant='text'
            color='text-description'
            icon=faBars
            onPress=() => $sidebarOpened.set(!$sidebarOpened.get())
        )
        H1.title Admin
        Div.right(row gap vAlign='center')
        MODULE.RenderHook(name='renderTopbarRight')
    Slot
    `
```

## Summary
    - Module creation is done using the createModule function.
    - A module is written with future modifications in mind using plugins.
    - Interaction with plugins occurs through MODULE.hook(<event_name>)
    - Ready JSX is output using the client-side hook `MODULE.RenderHook(name=<event_name>)
    - Most importantly, what a developer needs to know is that plugins don't exist separately from modules, they are always written either for the base Startupjs module without explicit for specification, or for new modules, as in our example.

Based on this guide, you've learned to create your own modules and plugins for them.