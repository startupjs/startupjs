# @startupjs/babel-plugin-startupjs-plugins

Gather startupjs modules and plugins together with their options to be feed into registry.

## Example

```jsx
import plugins from 'startupjs/plugins'
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import module1 from '/path/to/module-1'
import plugin1Isomorphic from '/path/to/startupjs-plugin-1/isomorphic'
import plugin1Server from '/path/to/startupjs-plugin-1/server'
import plugin1ServerConfig from '/startupjs.config/startupjs-plugin-1/server'
const plugins = [
  {
    type: 'module',
    name: 'module-1'
  },
  {
    type: 'plugin',
    name: 'startupjs-plugin-1',
    for: 'startupjs',
    inits: [
      {
        env: 'isomorphic',
        init: plugin1Isomorphic,
        config: {}
      },
      {
        env: 'server',
        init: plugin1Server,
        config: plugin1ServerConfig
      },
    ]
  }
]
```

## Options

`useRequireContext` -- compile virtual models import to use `require.context` for dynamically
importing things

## License

MIT
