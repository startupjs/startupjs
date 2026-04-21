# Plugins in Startupjs

## What are plugins and why are they needed

The Startupjs platform supports a plugin system that allows you to easily integrate additional code blocks into your application, thereby extending the application's functionality. These blocks are what we call plugins. With plugins, you can add new components, routes, server functionality, and much more, allowing us to adapt the application to specific needs. All of this becomes available without needing to modify the main application code.

Overall, the plugin system in Startupjs provides flexibility and extensibility when developing websites or mobile applications, making it an attractive choice for many developers.


## How the plugin system works

1) **Plugin creation**: Developers create plugins in separate files with the pattern *.plugin.js. Plugins are created using the createPlugin function.

2) **Plugin registration**: Developers register plugins in the application by specifying information about them in special places: these are the package.json and startupjs.config.js files.

3) **Hooks and events**: Plugins subscribe to specific events that are generated within the application and respond to them by executing certain actions. When a required event occurs (for example, session initialization on the server), the system launches the corresponding plugins, allowing them to execute their logic. Event tracking is performed using [hooks](https://github.com/startupjs/startupjs/blob/master/docs/general/en/hooks.en.md).

4) **Plugin initialization**: When the application starts, the system launches the registered plugins. All functionality is implemented through hooks.



## Types of hooks

**Hooks** are special functions used in the Startupjs plugin system to define plugin functionality in different runtime environments. In other words, developers can explicitly specify which runtime environment specific code is intended for. In Startupjs, there are three runtime environments: client-side, server-side, and isomorphic. Accordingly, our hooks are divided into three types, each of which will work in its own runtime environment - client-side, server-side, and isomorphic hooks.

- **Client-side hooks**: Execute on the client-side of the application, in the user's browser. They can contain code related to the user interface or client-side logic.

- **Server-side hooks**: Execute on the server-side of the application, in the Node.js environment. They can contain code related to HTTP request processing, API configuration, etc.

- **Isomorphic hooks**: Execute on both client-side and server-side of the application. This allows sharing code between client and server, which simplifies application development and maintenance.

Here's an example of how this might look:

```js
import { createPlugin } from 'startupjs';

export default createPlugin({
  name: 'myPlugin',
  // client, server, isomorphic - these are the runtime environments for which we will define hooks
  client: (pluginOptions) => ({
    // Client-side hooks
    // Code for execution on the client-side of the application
  }),
  server: (pluginOptions) => ({
    // Server-side hooks
    // Code for execution on the server-side of the application
  }),
  isomorphic: (pluginOptions) => ({
    // Isomorphic hooks
    // Code that should execute on both client and server
  })
})
```

Technically, client, server, and isomorphic are functions that accept user options (pluginOptions) and return an object with various hooks containing their configurations and functionality, which are related to the client-side, server-side, or both simultaneously.

Code written for client will go into the client bundle, for server - into the server bundle, code from isomorphic will go into both bundles.

## Read more:
- [How to create a plugin](https://github.com/startupjs/startupjs/blob/master/docs/general/en/create-plugin.en.md)