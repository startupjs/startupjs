# @startupjs/babel-plugin-ts-to-json-schema

Transform TypeScript interface to JSON Schema to be used in Docs.

## Usage

When using as part of 'babel-preset-startupjs', enable this plugin by passing the option `docgen: true`:

```js
presets: [
  ['babel-preset-startupjs', { docgen: true }]
]
```

### Options

```js
// defaults
{
  magicExportName: '_PropsJsonSchema',
  interfaceMatch: 'export interface'
}
```

## License

MIT
