# @startupjs/babel-plugin-i18n-extract
> Babel Plugin for i18n Automation

This is a Babel plugin that automates i18n tasks by extracting translation keys and default values from your source code. It processes files with the following extensions: `js`, `jsx`, `ts`, `tsx`, `mjs`, `cjs`, `web.js`, `web.jsx`, `web.ts`, `web.tsx`, `web.mjs`, and `web.cjs`.

## Installation

To use this plugin, first install it as a dependency:

```bash
npm install --save-dev babel-plugin-i18n-automation
```

Then, add the plugin to your Babel configuration:

```json
{
  "plugins": ["babel-plugin-i18n-automation"]
}
```

## Usage

This plugin looks for the `t` function imported from the following libraries:

- `startupjs`
- `startupjs/i18n`
- `@startupjs/i18n`

The `t` function is used to mark strings for translation. It should be called with two string literal arguments: the translation key and the default value.

For example:

```jsx
import { observer, t } from 'startupjs';

export default observer(function App() {
  return <span>{t('key', 'defaultValue')}</span>;
});
```

During the build process, the plugin will extract the keys and default values and save them in a `translations.json` file.

## Configuration Options

The plugin accepts an optional `collectTranslations` configuration option:

```json
{
  "plugins": [
    ["babel-plugin-i18n-automation", { "collectTranslations": true }]
  ]
}
```

When `collectTranslations` is set to `true`, the plugin will merge the translations from different file extensions (web, android, ios) into a single translation object.

## Tests

The plugin includes tests to ensure it works correctly. The `__tests__/translations.spec.js` file checks if the generated `translations.json` file matches the expected content. The `__tests__/index.spec.js` file contains various test cases to ensure the plugin behaves as expected.

To run the tests, simply execute:

```bash
npm test
```

## License

This plugin is licensed under the [MIT License](LICENSE).
