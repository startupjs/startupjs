# How to create your own plugin

To create a plugin file for Startupjs, you must follow certain naming and file placement conventions. Here are the steps that will help you do this:

1) Choose a name for the plugin file. The name should be unique and reflect its functionality. For example, customInputType.plugin.js. It's important that the filename contains the .plugin.js suffix so that the Startupjs system can correctly identify it as a plugin.

2) Create the plugin file in a convenient location inside your module's folder. There are no strict rules regarding folder structure for plugins, but it's recommended to maintain cleanliness and order in your project structure. You can also create plugins for your entire project/application.

3) For Startupjs to be able to discover your plugin, you need to add it to the package.json of your module. This is done by adding the path to the plugin file in the exports section. If the plugin is written for the entire project/application, use the package.json from the project root.

4) Make sure the path to the plugin file is specified relative to the root of your project. After this, when starting Startupjs, the system will automatically process your plugin according to the provided exports.

Let's look at an example.

Let's create a customInputType.plugin.js file.
The plugin will look like this:

```js
import { createPlugin } from 'startupjs/registry'

// plugin is created using the createPlugin function
export default createPlugin({
  // name - unique plugin name
  name: 'custom-input-type',
  // enabled indicates whether the plugin is enabled or not.
  // If its value is false, the plugin is considered disabled and its
  // functionality will not be activated in the application.
  enabled: true,
  // client, isomorphic, server - runtime environment
  client: (pluginOptions) => ({
    // Here you can add implementation of client-side hooks. For example,
    // for demonstration, let's add the customFormInputs hook
    customFormInputs: () => ({
      // Code. We'll look at how this and other hooks work in more detail later
    })
  }),
  server: (pluginOptions) => ({
    // Here you can add implementation of server-side hooks. For example,
    // for demonstration, let's add the api hook
    api: (expressApp) => {
      expressApp.get('/api/your-unique-path', async (req, res) => {})
      expressApp.post('/api/your-unique-path', async (req, res) => {})
    }
  }),
  isomorphic: (pluginOptions) => ({
    // Here you can add implementation of isomorphic hooks
  }),
})
```

Add information about this file to the `exports` section of the `package.json` file according to its name, for example, `customInputType.plugin.js`, so it automatically loads into your application. If plugins are in a separate folder, you need to account for the path.

You can connect any number of plugins. To do this, simply list them separated by commas.

```json
"exports": {
  "./plugins/customInputType.plugin": "./plugins/customInputType.plugin.js",
  "./plugins/firstPlugin.plugin": "./plugins/firstPlugin.plugin.js",
  "./plugins/secondPlugin.plugin": "./plugins/secondPlugin.plugin.js"
}
```

To pass parameters to the plugin (pluginOptions in our example), you need to specify them in the startupjs.config.js file, which is located in the root folder of your project. To do this, first import the plugins into this file, then specify parameters for each plugin in the plugins section, where keys are plugin names and values are objects with parameters for server-side, client-side, and isomorphic hooks:

```js
  // import plugins from corresponding files
  import customInputType from './plugins/customInputType.plugin.js'
  import firstPlugin from './plugins/firstPlugin.plugin.js'

  export default {
    plugins: {
      // Here customInputType, firstPlugin - are the plugin names under which we imported them
      // firstPlugin is specified as an example to show how we add multiple plugins to this file
      [customInputType]: {
        // Here we specify everything related to server-side hooks
        server: {
          // List of parameters for server-side hooks. They will be stored in pluginOptions and available in hooks.
          someServerOption: 'some value'
        },
        // Here we specify everything related to client-side hooks
        client: {
          // List of parameters for client-side hooks. They will be stored in pluginOptions and available in hooks.
          someClientOption: 'some value'
        },
        // Here we specify everything related to isomorphic hooks
        isomorphic: {
          // List of parameters for isomorphic hooks. They will be stored in pluginOptions and available in hooks.
          someIsomorphicOption: 'some value'
        }
      },
      // separated by comma, we list other plugins. In our case firstPlugin
      [firstPlugin]: {
        // If parameters for client are not needed, you can simply not specify this block. Similarly with server and isomorphic
        // For this plugin, for example, we need to pass options only for server-side hooks.
        server: {
          someOption: 'Hello from server!'
        }
      }
      // Here you can add your plugin with a list of necessary parameters.
    }
  }
```

### Order (optional)

Optionally in createPlugin you can add order - the execution order of plugins, by specifying an execution "group".
In addition to the "groups" listed below, you can also use variants 'before group' and 'after group'.

Possible group variants in their execution order:

```js
  'first',
  'root',
  'session',
  'auth',
  'api',
  'pure', // for pure startupjs plugins that don't depend on 'ui' or 'router'
  'ui', //  for plugins that depend on 'ui'
  'router', // for plugins that depend on 'router'
  'default', // default group that executes after all others
  'last'
```

For example,

```js
export default createPlugin({
  name: 'my-plugin',
  order: 'ui',
  client: (pluginOptions) => ({
    // ...
  })
})
```

### For (optional)

The for property specifies which module this plugin is created for. For example, if you're creating a plugin for the admin module, you can specify for: 'admin'. [Read more about modules here](https://github.com/startupjs/startupjs/blob/master/docs/general/en/about-modules.en.md)

For example,

```js
export default createPlugin({
  name: 'my-plugin',
  for: 'admin',
  client: () => ({
    // ...
  })
})
```

When you create a plugin with for: 'admin' specified, StartupJS automatically connects this plugin to the module named "admin".
If for is not specified, the default module will be the Startupjs platform itself.


## Read more:
- [Hooks for plugins](https://github.com/startupjs/startupjs/blob/master/docs/general/en/hooks.en.md)