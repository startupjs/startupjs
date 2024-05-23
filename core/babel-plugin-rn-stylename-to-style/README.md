# @startupjs/babel-plugin-rn-stylename-to-style

Transform JSX `styleName` property to `style` property in react-native. The `styleName` attribute and syntax are based on [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules#conventions).

## Information

This is the fork of https://github.com/kristerkari/babel-plugin-react-native-stylename-to-style

The differences are:

1. Support resolving multi-class selectors in CSS:

```jsx
import classnames from 'classnames'

function Button ({
  variant,  // [string] 'primary' | 'secondary'
  dark,     // [bool]
  disabled  // [bool]
}) {
  return (
    <Text
      styleName={classnames('button', [variant, { dark, disabled }])}
    >CLICK ME</Text>
  )
}
```

```sass
.button
  background-color: blue
  &.primary
    color: #ff0000
    &.disabled
      color: rgba(#ff0000, 0.5)
  &.secondary
    color: #00ff00
    &.disabled
      color: rgba(#00ff00, 0.5)
  &.disabled
    color: #777

.dark
  &.button
    background-color: purple
    &.primary
      color: white
      &.disabled
        color: #ddd
  &.disabled
    color: #eee
```

And what's important is that selectors` specificity is properly emulated. For example:

Styles for `.button.primary.disabled` (specificity *30*) will override styles of `.button.disabled` (specificity *20*),
even though `.button.disabled` is written later in the CSS.

This simple change brings a lot more capabilities in theming your components for a dynamic look.

2. Convert any `*StyleName` attribute to the according `*Style` attribute. This is very useful for passing the sub-element styles (which are usually exposed by react-native libraries) directly from CSS.

3. If the `styleName` value is an object or an array, automatically pipe it through the `classnames`-like library.

4. Support for multiple named css file imports is removed

## Usage

**WARNING:** This plugin is already built in into the `babel-preset-startupjs` and is included into the default StartupJS project.

If you want to use this plugin separately from StartupJS:

### Step 1: Install

```sh
yarn add --dev @startupjs/babel-plugin-rn-stylename-to-style
```

or

```sh
npm install --save-dev @startupjs/babel-plugin-rn-stylename-to-style
```

### Step 2: Configure `.babelrc`

You must give one or more file extensions inside an array in the plugin options.

```
{
  "presets": [
    "react-native"
  ],
  "plugins": [
    ["react-native-dynamic-stylename-to-style", {
      "extensions": ["css"]
    }]
  ]
}
```

### Plugin Options

#### `extensions`

**Required**

List of css extensions to process (`css`, `styl`, `sass`, etc.)

#### `useImport`

**Default:** `false`

Whether to generate ESM `import` instead of CJS `require`.

#### `parseJson`

**Default:** `false`

Whether the imported css is expected to be a JSON string or an object.
If this flag is specified then JSON string is expected and it will do `JSON.parse` on it.

## Syntax

## Anonymous reference

Anonymous reference can be used when there is only one stylesheet import.

### Single class

```jsx
import "./Button.css";

<View styleName="wrapper">
  <Text>Foo</Text>
</View>;
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import Button from "./Button.css";

<View style={Button.wrapper}>
  <Text>Foo</Text>
</View>;
```

### Multiple classes

```jsx
import "./Button.css";

<View styleName="wrapper red-background">
  <Text>Foo</Text>
</View>;
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import Button from "./Button.css";

<View style={[Button.wrapper, Button["red-background"]]}>
  <Text>Foo</Text>
</View>;
```

### Expression

```jsx
import "./Button.css";
const name = "wrapper";

<View styleName={name}>
  <Text>Foo</Text>
</View>;
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import Button from "./Button.css";
const name = "wrapper";

<View
  style={(name || "")
    .split(" ")
    .filter(Boolean)
    .map(function(name) {
      Button[name];
    })}
>
  <Text>Foo</Text>
</View>;
```

### Expression with ternary

```jsx
import "./Button.css";

const condition = true;
const name = "wrapper";

<View styleName={condition ? name : "bar"}>
  <Text>Foo</Text>
</View>;
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import Button from "./Button.css";

const condition = true;
const name = "wrapper";

<View
  style={((condition ? name : "bar") || "")
    .split(" ")
    .filter(Boolean)
    .map(function(name) {
      Button[name];
    })}
>
  <Text>Foo</Text>
</View>;
```

### with `styleName` and `style`:

```jsx
import "./Button.css";

<View styleName="wrapper" style={{ height: 10 }}>
  <Text>Foo</Text>
</View>;
```

↓ ↓ ↓ ↓ ↓ ↓

```jsx
import Button from "./Button.css";

<View style={[Button.wrapper, { height: 10 }]}>
  <Text>Foo</Text>
</View>;
```

## ::part() selector

### Preprocess `part` attribute.

- Each `part` gets its styles from the `{part}Style` prop.
- `part='root'` is magic -- it's linked to the pure `style` prop.

Here is an example `<Card>` component which specifies its root container, title and footer as stylizable parts:

```jsx
// Card.js

function Card ({ title }) {
  return (
    <View part='root'>
      <Text part='header'>{title}</Text>
      <Text part='footer'>Copyright</Text>
    </View>
  )
}
```

**↓ ↓ ↓ ↓ ↓ ↓**

```jsx
function Card ({ title, style, headerStyle, footerStyle }) {
  return (
    <View style={style}>
      <Text style={headerStyle}>{title}</Text>
      <Text style={footerStyle}>Copyright</Text>
    </View>
  )
}
```

### Preprocess `::part()` selector from CSS file to style any component which uses `part` attributes.

Following an example `<Card>` component above, we can call `<Card>` from the `<App>` and customize its parts styles:

```jsx
// App.js

import Card from './Card'
import './index.styl'

function App ({ users }) {
  return users.map(user => (
    <Card styleName='user' title={user.name} />
  ))
}
```

```styl
// index.styl

.user
  margin-top 16px

  &:part(header)
    background-color black
    color white

  &:part(footer)
    font-weight bold
```
