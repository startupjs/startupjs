# StartupJS — Guide for AI Agents

This document explains how to write code for StartupJS applications. Follow these rules to produce correct, working code.

## Project Setup

StartupJS is built on top of Expo. A new project is created by:

1. Creating an Expo app: `yarn create expo-app myapp` (or `npx create-expo-app@latest myapp`)
2. Installing StartupJS: `npm init startupjs@latest`
3. Wrapping the root layout in `app/_layout.tsx` with `<StartupjsProvider>` from `'startupjs'` and `<Layout>` from `'startupjs-ui'` inside it:

```jsx
import { StartupjsProvider } from 'startupjs'
import { Layout } from 'startupjs-ui'
import { Stack } from 'expo-router'

export default function RootLayout () {
  return (
    <StartupjsProvider>
      <Layout>
        <Stack screenOptions={{ headerShown: false }} />
      </Layout>
    </StartupjsProvider>
  )
}
```

`Layout` renders content within safe area boundaries so it does not overlap the system UI (status bar, home indicator) on mobile devices.

Requirements: Node 22+. Yarn is optional. MongoDB and Redis are NOT needed for development (mocked automatically).

All application code should be written in TypeScript (`.ts` / `.tsx`). The only exception is `startupjs.config.js`, which must stay plain ESM JavaScript.

The default Expo template uses a `(tabs)` layout. The home page is at `app/(tabs)/index.tsx`, NOT `app/index.tsx`. The root layout is always `app/_layout.tsx`.

## Running the App

Start the development server:

```bash
npm run web        # web browser
npm run ios        # iOS simulator
npm run android    # Android emulator
```

Or equivalently: `npm start -- --web`, `npm start -- --ios`, `npm start -- --android`.

The web app will be available at `http://localhost:8081` by default. The server starts Metro Bundler, compiles the JS bundle, and opens a WebSocket for real-time data sync. The first load takes 15–30 seconds to compile.

## E2E Testing Guide

If the project has Playwright E2E tests already, or if you are asked to add or update them, read `./E2E_GUIDE.md` first and follow it. This includes both extending an existing E2E suite and setting up a new one from scratch.

## Imports

**Core framework** — import from `'startupjs'`:

```js
import { $, observer, useSub, sub, pug } from 'startupjs'
```

**UI components** — import from `'startupjs-ui'`:

```js
import { Button, Card, Span, TextInput, Div, Content, Checkbox } from 'startupjs-ui'
```

Always prefer `startupjs-ui` components over `react-native` ones (e.g. `Div` instead of `View`, `Span` instead of `Text`). However, if something is not covered by `startupjs-ui`, it is fine to import from `react-native` (e.g. `Image`, `Platform`, `Animated`).

## Pug Templates

StartupJS uses **pug** as the standard template language instead of JSX. Pug is indentation-based — no closing tags, no angle brackets. It compiles to JSX at build time.

### Basic syntax

```js
return pug`
  Div.container
    Span.title Hello World
    Button(onPress=handleClick) Click Me
`
```

This compiles to:

```jsx
<Div styleName="container">
  <Span styleName="title">Hello World</Span>
  <Button onPress={handleClick}>Click Me</Button>
</Div>
```

### Key rules

- **Nesting** is defined by indentation (2 spaces)
- **Classes** use `.className` — they become the `styleName` prop
- **Attributes** go in parentheses: `(prop=value)` — no `{}` needed around JS expressions
- **Text content** goes after the tag: `Span Hello` or use `=` for a variable: `Span= title`
- **Inline interpolation** uses `#{}`: `Span Welcome, #{name}!`
- **Children** from props: `= children`
- **Boolean attributes**: `Content(padding)` is the same as `Content(padding=true)`

### Conditional rendering

```js
pug`
  if isLoggedIn
    Span Welcome back!
  else
    Button(onPress=login) Log In
`
```

You can also use `unless`:

```js
pug`
  unless hasItems
    Span No items yet
`
```

### Loops with `each`

`each` compiles to `.map()` under the hood. When iterating over a query signal, each iteration variable is a signal pointing to that document:

```js
pug`
  each $todo in $todos
    Card(key=$todo.getId())
      Span= $todo.title.get()
`
```

Here `$todos` is a query signal from `useSub()`, and each `$todo` is a document signal — so you can call `.get()`, `.set()`, `.del()` directly on it.

For regular arrays, the pattern is the same:

```js
pug`
  each item in items
    Span(key=item.id)= item.name
`
```

### Attributes

```js
// Simple attributes
pug`
  Button(size='m' variant='flat') Add
`

// JS expressions — no {} needed
pug`
  TextInput(value=$title.get() onChangeText=val => $title.set(val) placeholder='Enter title')
`

// Multiline attributes for readability
pug`
  Button(
    icon=faTimes
    iconColor='error'
    size='s'
    onPress=() => $todo.del()
  )
`
```

### Dynamic class names

Use array syntax with an object for conditional modifiers:

```js
pug`
  Span(styleName=['todoTitle', { completed: $todo.completed.get() }])
    = $todo.title.get()
`
```

## Signals

Signals are the core data primitive. A signal is a reactive pointer to data — it does not hold data itself.

### The root signal: `$`

`$` is the global entry point to all data. Navigate it with dot or bracket notation:

```js
$.todos              // collection signal
$.todos['abc123']    // document signal
$.todos['abc123'].title  // field signal
```

### Local signals: `$()`

`$()` called as a function creates a local reactive variable (like React's `useState`):

```js
const $count = $(0)
$count.get()     // 0
$count.set(5)    // updates to 5

const { $name, $age } = $({ name: 'Alice', age: 30 })
```

**IMPORTANT**: `$` (the root signal) and `$()` (local signal factory) are the SAME import but different usages. `$` with dot notation navigates the data tree. `$()` with parentheses creates a local signal.

### Reading: `.get()`

```js
const name = $user.name.get()        // returns the plain value
const todo = $todo.get()             // returns the entire document object
```

`.get()` is synchronous.

### Writing: `.set()`

```js
$user.name.set('Bob')                // updates a field
await $todo.completed.set(true)      // async for database signals
```

For database signals, `.set()` returns a Promise. The local UI updates instantly; the server sync happens in the background. You usually do NOT need to `await` it.

### Deleting: `.del()`

```js
await $todo.del()                    // deletes entire document
$user.avatar.del()                   // deletes a field
```

### Adding documents: `.add()`

```js
const newId = await $.todos.add({ title: 'Buy milk', completed: false })
```

Creates a new document with an auto-generated ID. Returns the ID. You can also pass an explicit `id` field:

```js
await $.todos.add({ id: 'custom-id', title: 'Buy milk' })
```

### Updating multiple fields: `.assign()`

```js
await $todo.assign({ title: 'Updated', priority: 'high' })
```

Only sets the fields you provide. Fields set to `null` or `undefined` are deleted.

### Array operations

```js
await $user.tags.push('developer')   // append to array
const last = await $user.tags.pop()  // remove last item
```

### Incrementing: `.increment()`

```js
await $user.loginCount.increment(1)  // add 1
await $user.score.increment(-5)      // subtract 5
```

### Getting document ID: `.getId()`

```js
const id = $todo.getId()             // returns the document's unique ID
```

**CRITICAL**: Use `.getId()` to get a document's ID. Do NOT use `.id` — that is a UUID generator method on the root signal, not a field accessor.

```js
// CORRECT
$todo.getId()        // returns 'abc123'

// WRONG — .id is a method, not a field
$todo.id.get()       // DOES NOT WORK
```

### Getting query IDs: `.getIds()`

```js
const ids = $todos.getIds()          // returns ['id1', 'id2', ...]
```

### Passing signals to child components

Always pass signals (not raw values) to child components. Call `.get()` as late as possible — only when the raw data is actually needed for display or logic:

```js
// CORRECT — pass the signal, child reads it
function Parent () {
  const $user = useSub($.users[userId])
  return pug`
    UserName($name=$user.name)
  `
}

const UserName = observer(function UserName ({ $name }) {
  return pug`
    Span= $name.get()
  `
})

// WRONG — extracting the value too early
function Parent () {
  const $user = useSub($.users[userId])
  return pug`
    UserName(name=$user.name.get())
  `
}
```

By passing `$user.name` (signal) instead of `$user.name.get()` (value), the child component can both read and write the data, and only re-renders when that specific field changes.

## Subscriptions

You MUST subscribe to database data before reading it. Private collections (`$._session`) do NOT need subscriptions.

### In React components: `useSub`

```js
// Subscribe to a single document
const $todo = useSub($.todos[todoId])

// Subscribe to a query (multiple documents)
const $todos = useSub($.todos, { completed: false })

// Subscribe to all documents
const $todos = useSub($.todos, {})
```

### Outside React: `sub`

```js
const $todo = await sub($.todos[todoId])
const $todos = await sub($.todos, { status: 'active' })
```

### Query signals

Query signals returned by `useSub($.collection, query)` are iterable:

```js
// .map() — returns array
$todos.map($todo => $todo.title.get())

// for...of — iterate document signals
for (const $todo of $todos) {
  console.log($todo.title.get())
}

// .find() — first matching document signal
const $first = $todos.find($todo => !$todo.completed.get())

// .reduce()
const count = $todos.reduce((sum, $todo) => sum + ($todo.completed.get() ? 1 : 0), 0)

// .getIds() — array of IDs
const ids = $todos.getIds()
```

In pug templates, use `each` to iterate query signals (see Pug Templates section above).

## ORM Models

StartupJS uses Teamplay ORM under the hood. In app code, import ORM helpers from `'startupjs'`, not directly from `'teamplay'`.

### Standard Model Layout

Use separate files inside `models/`:

- `models/users/index.ts` → collection model for `users`
- `models/users/[id].ts` → document model for `users.*`
- `models/users/schema.ts` → schema for `users`
- `models/users/access.ts` → access rules for `users`
- `models/users/_active.ts` → server aggregation for `users`
- files or folders starting with `-` are ignored by the model loader and can be used for helpers inside `models/`

Preferred convention:

- collection file: default export class extending `Signal` with collection-level methods
- document file: default export class extending `Signal` with document-level methods
- schema file: default export schema object
- access file: default export `accessControl({ ... })`
- aggregation file: default export `aggregation(...)`

Only collection-level files get `schema`, `access`, and `_...` aggregations. Access control, schema validation, and server aggregations are registered only for top-level collections.

Basic model class shape:

```js
import { Signal } from 'startupjs'

export default class Users extends Signal {
  async addNew (user) {
    return await this.add(user)
  }
}
```

### Feature Flags

Model security and aggregation behavior live in `startupjs.config.js`:

```js
export default {
  features: {
    enableServer: true,
    validateSchema: true,
    serverAggregate: true,
    // accessControl: true
  }
}
```

Guidelines:

- always enable `validateSchema: true`
- always define a schema for every real collection
- enable `serverAggregate: true` from the start, even if you do not need aggregations yet
- `accessControl: true` may be skipped only during the earliest POC stage; once data matters, enable it and add rules

### Schema

Schema belongs in `models/<collection>/schema.ts` and should always exist for public collections. For private root collections such as `_session`, `models/_session/schema.ts` describes the whole private value directly, not a document inside a collection, and is used for TypeScript typing only.

StartupJS uses a simplified JSON Schema format:

- export the properties object directly, without the top-level `type: 'object'`
- mark required fields inline with non-standard `required: true` on the field itself
- at runtime this is converted into normal JSON Schema before validation

With `validateSchema: true`, writes are checked on the backend at runtime. Invalid writes are rejected and rolled back on the client.

Example:

```js
export default {
  userId: { type: 'string', required: true },
  title: { type: 'string', required: true },
  done: { type: 'boolean' },
  createdAt: { type: 'number', required: true }
}
```

Schema should describe the real stored shape, including generated fields like `createdAt`, tokens, relation ids, and structured objects. The same schema can also be reused in forms.

### Queries

Use normal queries inline in `useSub()` / `sub()` for ordinary filtering and sorting:

```js
const $users = useSub($.users, { orgId, active: true })
```

The query language is MongoDB query syntax. In production StartupJS uses real MongoDB. In local development it uses a mocked Mongo-compatible backend based on `mingo`, so the same query operators work there too.

Normal queries are the default choice because:

- they are fully and immediately reactive
- they are automatically filtered by access control through the `read` rule on each returned document

### Access Control

Access rules live in `models/<collection>/access.ts` and must be wrapped in `accessControl(...)`. When the rules are in a separate file, use a default export.

Example:

```js
import { accessControl } from 'startupjs'

export default accessControl({
  create: ({ session, newDoc }) => session.userId === newDoc.userId,
  read: ({ session, doc }) => session.userId === doc.userId,
  update: ({ session, doc }) => session.userId === doc.userId,
  delete: ({ session }) => {
    // `session.isAdmin` is project-specific. Replace with your own admin check.
    return session.isAdmin
  }
})
```

Guidelines:

- define access only on top-level collection models
- keep normal queries inline; access control already applies to them automatically
- if access control is not enabled yet, still keep the future access shape in mind when designing model methods and aggregations

### Aggregations

Use `models/<collection>/_name.ts` with a default export `aggregation(...)` only when you need a real aggregation pipeline, for example `$group`, `$project`, `$lookup`, `$unwind`, or similar stages.

Do not use an aggregation for a single `$match`. That is just a normal query and should stay a normal query.

This distinction matters because:

- simple queries are immediately reactive
- aggregations update through polling and are therefore heavier and less immediate

Example:

```js
import { aggregation } from 'startupjs'

export default aggregation(({ orgId }, { session }) => {
  if (!orgId) return
  if (!session.userId) return

  return [
    { $match: { orgId } },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]
})
```

Guidelines:

- prefer normal queries first
- add a `_...` aggregation only when query syntax is not enough
- validate params before returning a pipeline
- when access control is enabled, also validate session/access inside the aggregation itself, because aggregations are not automatically protected by `read`

### When To Add ORM Methods

Do not create custom ORM methods for every write. For simple operations on a single field, use the standard signal methods directly:

- `.set()`, `.del()`, `.assign()`, `.increment()`
- array operations like `.push()`, `.pop()`, `.insert()`, `.remove()`

Add a custom collection or document method when the operation has real business meaning, for example:

- creating a document with generated fields or defaults
- updating multiple fields together as one domain action
- encapsulating reusable computed/business logic on a document
- hiding server-only or DB-specific details behind a stable API

Rule of thumb:

- simple field mutation or normal query → use signals directly
- meaningful domain operation → add an ORM method

## observer()

**Always wrap every component with `observer()`** — this is the default for all StartupJS components:

```js
import { observer, $, useSub, pug } from 'startupjs'
import { Span } from 'startupjs-ui'

export default observer(function MyComponent () {
  const $todo = useSub($.todos[todoId])
  return pug`
    Span= $todo.title.get()
  `
})
```

`observer()` is required for signals reactivity, `useSub` subscriptions, and styles caching. Wrap all components by default — not just those that explicitly read signals.

## Private Collections

Private collections live only on the client. They start with `_` and do NOT need subscriptions. `$._session` also has the convenience alias `$.session`:

```js
// Session-scoped (persists until tab closes)
const userId = $.session.userId.get()
```

Private collection schemas are defined for the whole private value:

```ts
// models/_session/schema.ts
import { defineSchema } from 'startupjs'

export default defineSchema({
  userId: { type: 'string' },
  banner: {
    type: 'object',
    properties: {
      visible: { type: 'boolean' }
    }
  }
})
```

Private schemas are skipped by backend validation; they exist to type client-local signals like `$.session.banner.visible`.

## Current User

StartupJS automatically provides a unique user ID on the client via `$.session.userId`:

```js
const userId = $.session.userId.get()
```

This ID is generated per browser session and persists until the tab is closed. Use the `users` collection to store per-user data (preferences, progress, settings, etc.):

```js
const userId = $.session.userId.get()
const $user = useSub($.users[userId])

// Create user doc on first visit if it doesn't exist.
// Throw the promise — Suspense (inside observer) will catch it
// and re-render the component once the doc is created on the backend.
if (!$user.get()) {
  throw $.users.add({ id: userId, name: '', settings: {} })
}

// Read user data in render
const name = $user.name.get()

// Write user data in event handlers (async functions)
async function updateTheme () {
  await $user.settings.theme.set('light')
}
```

**IMPORTANT**: Use `throw` (not `await`) when creating docs inside a component render body. The thrown promise is caught by Suspense (built into `observer`) which suspends the component until the document is created, then re-renders. Pass the explicit `id: userId` so the document ID matches the session user ID. Use `await` only inside event handlers and other async functions — never in the render body itself.

## UI Components

All components below are imported from `'startupjs-ui'`. For detailed API docs on any component, read its README at:

```
./node_modules/@startupjs-ui/<kebab-case-name>/README.mdx
```

For example, the `FileInput` docs are at `./node_modules/@startupjs-ui/file-input/README.mdx`.

### Layout & Structure

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Div` | Container (replaces `View`). Supports press handling, layout helpers, shadows, shapes | `row`, `align`, `vAlign`, `gap`, `onPress`, `level`, `wrap` |
| `Content` | Page wrapper with optional padding | `padding`, `width`, `style` |
| `Card` | Bordered container for visual grouping. Inherits Div props | `level`, `onPress`, `variant` |
| `Layout` | Root app element, renders content within safe area boundaries | `style` |
| `Sidebar` | Collapsible side panel for navigation | `$open`, `position`, `width` |
| `SmartSidebar` | Responsive sidebar: fixed on desktop, drawer on mobile | `$open`, `breakpoint`, `position`, `width` |
| `DrawerSidebar` | Drawer-style navigation panel | `$open`, `renderContent`, `position` |
| `Drawer` | Sliding panel from screen edge | `$visible`, `position`, `style` |
| `ScrollView` | Themed wrapper around RN ScrollView | `full`, all standard ScrollView props |
| `FlatList` | Performant list for large datasets (re-exported from RN) | `data`, `renderItem`, `keyExtractor` |
| `Portal` | Renders children outside current component hierarchy | `children` |
| `Divider` | Thin line separator between content sections | `size`, `style` |
| `Br` | Vertical spacing (line break) | `lines` (default `1`, each line = 16px) |

### Typography

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Span` | Base text component. Always wrap text in `Span`, never bare text | `h1`–`h6` (boolean, for headings), `bold`, `italic`, `description` |

**Headings**: Use boolean props on `Span`: `Span(h1) Title`, `Span(h2) Subtitle`, etc.

### Buttons & Actions

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Button` | Clickable button with multiple visual styles | `onPress`, `size` (`'s'`/`'m'`/`'l'`), `variant` (`'flat'`/`'outlined'`), `icon`, `color`, `disabled` |
| `Link` | Navigation within app and to external URLs | `to` (or `href`), `replace`, `style` |
| `Tag` | Small label/badge. Inherits Div props | `color`, `icon`, `onClose`, `size` |

### Form Inputs

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `TextInput` | Text field | `value`, `onChangeText`, `placeholder`, `label`, `description`, `icon`, `iconPosition` |
| `Checkbox` | Checkbox or toggle switch | `value` (boolean), `onChange` (receives new boolean), `variant` (`'checkbox'`/`'switch'`) |
| `NumberInput` | Numeric input with increment/decrement | `value`, `onChangeNumber`, `min`, `max`, `step` |
| `PasswordInput` | Password field with show/hide toggle. Inherits TextInput props | `value`, `onChangeText` |
| `Select` | Dropdown selector. Inherits TextInput props | `value`, `onChange`, `options` |
| `MultiSelect` | Select multiple options from a list | `value`, `onChange`, `options` |
| `Radio` | Pick one option from a list | `value`, `onChange`, `options` |
| `RangeInput` | Slider for selecting a value or range | `value`, `onChange`, `min`, `max`, `step` |
| `ColorPicker` | Color selector (hex format) | `value`, `onChange` |
| `DateTimePicker` | Date and time picker | `value`, `onChange`, `mode` (`'date'`/`'time'`/`'datetime'`) |
| `FileInput` | File/image upload | `value` (fileId), `onChange`, `accept` |
| `Input` | Universal input wrapper with two-way bindings | `$value`, `type`, `label`, `description` |
| `ArrayInput` | Dynamic array of inputs | `$value`, `properties` |
| `ObjectInput` | Dynamic form from declarative config | `$value`, `properties` |
| `Form` | Form renderer from JSON Schema-compatible definition | `$value`, `fields`, `properties` |
| `Rank` | Reorderable list of options | `value`, `onChange`, `options` |
| `Rating` | Five-star rating selector | `value`, `onChange` |
| `AutoSuggest` | Text input with filterable popup options | `value`, `onChangeText`, `options`, `onSelect` |

### Feedback & Overlays

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Alert` | Important message display | `variant` (`'info'`/`'success'`/`'warning'`/`'error'`), `icon`, `label` |
| `Modal` | Dialog overlay. Inherits RN Modal props | `$visible`, `title`, `onRequestClose` |
| `Popover` | Floating panel near an anchor element | `$visible`, `position`, `attachment` |
| `Dropdown` | Popup menu of selectable items | `$visible`, `onSelect`, `hasDrawer` |
| `Loader` | Spinning activity indicator | `size`, `color` |
| `Progress` | Progress bar (0–100) | `value`, `color`, `style` |
| `toast()` | Non-blocking notification (function, not component) | `toast('Message')`, `toast({ title, type })` |
| `Badge` | Small count/status indicator on UI elements | `value`, `position`, `color` |
| `Collapse` | Expandable/collapsible content section | `$open`, `title`, `children` |

### Navigation & Data

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Tabs` | Switch between different views | `$activeIndex`, `tabs`, `onChange` |
| `Breadcrumbs` | Navigational hierarchy trail | `routes`, `separator` |
| `Pagination` | Page navigation controls | `page`, `pages`, `onChangePage` |
| `Menu` | Vertical menu list. Inherits Div props | `children` (use `Menu.Item`) |
| `Item` | Content row with icon, text, and actions | `icon`, `onPress`, `children` |
| `Table` | Data table (`Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`) | `children` |

### Display

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Avatar` | User photo or initials | `src`, `size`, `children` (initials string) |
| `Icon` | FontAwesome icon display | `icon`, `size`, `color` |
| `User` | User display with avatar and name. Inherits Div props | `avatarUrl`, `name`, `description`, `onPress` |
| `Carousel` | Horizontally scrollable slide container | `children`, `isEndless`, `isLoop`, `onChange` |
| `AbstractPopover` | Low-level popover primitive | `$visible`, `anchor`, `position` |

### Drag & Drop

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `DragDropProvider` | Context provider for drag-and-drop | `children` |
| `Draggable` | Makes children draggable | `id`, `children` |
| `Droppable` | Drop target area | `id`, `onDrop`, `children` |

### Providers

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `DialogsProvider` | Enables `alert()`, `confirm()`, `prompt()` functions | Wrap at app root |
| `ToastProvider` | Enables `toast()` function | Wrap at app root |

### Page Structure

Every page should be wrapped in `ScrollView(full)` so it is scrollable on mobile:

```js
pug`
  ScrollView(full)
    Content(padding)
      Span(h1) My Page
      // ... page content
`
```

`ScrollView(full)` makes the scroll view take the full height of the screen. Without it, pages with long content will be cut off on mobile and the user won't be able to scroll.

### Layout with Div

```js
pug`
  Div(row align='between' vAlign='center')
    Span Left
    Button Right
`
```

- `row` — horizontal layout (default is vertical)
- `align` — justify-content: `'between'`, `'center'`, `'around'`
- `vAlign` — align-items: `'center'`, `'start'`, `'end'`

### Styles in `pug`

Write component styles directly inside the returned `pug` template using a top-level `style(lang='styl')` tag. This tag must be the last tag at the top level of the template:

```js
import { observer, pug } from 'startupjs'
import { Div, Span } from 'startupjs-ui'

export default observer(function MyComponent () {
  return pug`
    Div.root
      Span.title Hello
    style(lang='styl')
      .root
        padding 2u
      .title
        font-weight bold
        color #333
  `
})
```

This is the default and preferred way to write styles. In the normal case, there is no need to import `styl` at all.

The `u` unit equals 8px (design spacing unit). Always use `u` instead of `px` to follow the 8px grid. Use half-units (`0.5u`) when you need finer granularity (4px).

**Inline `style` props are an antipattern.** Only use `style` when you need a truly dynamic value from a JS variable (e.g. a computed width). For all other styling — spacing, colors, conditional variations — use classes with `styleName` and define the styles in the `style(lang='styl')` block.

### CSSXJS Selector Limits

`style(lang='styl')` is handled by `cssxjs`, which targets React Native styling semantics rather than a full browser CSS engine. Keep selectors scoped to one element or one exposed component part.

Supported patterns:

- same-element class selectors such as `.root`, `.title`, or `.myButton.primary`
- same-element modifiers via `&`, such as `&.completed`
- exposed part styling via `&:part(name)` when a component supports `part`

Not supported:

- selectors involving multiple different elements, such as `.section + .section`, `.section .title`, `.section > .title`, `.section ~ .title`
- web-only pseudo-classes and pseudo-elements such as `:hover`, `:active`, `:before`, `:after`

If you need to style a nested element, give that element its own `styleName` or expose a `part` and target it with `&:part(...)`. Do not rely on descendant/sibling selectors.

### Conditional Styles with `styleName`

Use the array pattern for conditional classes:

```js
pug`
  Span(styleName=['title', { completed: $todo.completed.get() }])
    = $todo.title.get()
`
```

The array pattern has three parts:
1. **Base class** — always applied (`'title'`)
2. **Variant variables** — string variables mapping to class names
3. **Boolean modifiers** — object where keys become classes when values are truthy (`{ completed }`)

Use `&` parent selector for modifier styles:

```pug
style(lang='styl')
  .title
    font-size 2u
    &.completed
      text-decoration line-through
      color #999
```

### Module-Level Styles

It is possible to use the `styl` template string directly at module level to share styles across multiple components in the same file, or inside a component to scope styles to that component's pug templates. However, this is an antipattern and should be avoided unless you specifically need shared styles across components in one file. Prefer putting styles directly into each component's `style(lang='styl')` block.

If you do need shared styles across multiple components in one file, module-level `styl` is the escape hatch:

```js
import { pug, styl } from 'startupjs'

styl`
  .shared
    padding 2u
`

function ComponentA () {
  return pug`
    Div.shared A
  `
}

function ComponentB () {
  return pug`
    Div.shared B
  `
}
```

## Routing (Expo Router)

StartupJS uses Expo Router for file-based routing:

- `app/index.tsx` → `/`
- `app/about.tsx` → `/about`
- `app/users/[id].tsx` → `/users/:id`
- `app/_layout.tsx` — wraps child routes

Navigation:

```js
import { Link } from 'expo-router'

pug`
  Link(href='/about') About
`

// or programmatically
import { router } from 'expo-router'
router.push('/about')
```

## Required Validation

After making code changes, always verify that the project still passes linting and type checks:

```bash
npx eslint .
npx startupjs check
```

If Playwright E2E tests are already present in the project, run them after linting and type checks:

```bash
npx playwright test
```

Do not skip these checks after writing code.

If E2E tests exist and you change application behavior, UI, flows, or accessibility semantics, you must keep the E2E suite accurate. Update existing tests and add new ones when needed so the suite continues to cover the full functionality affected by your changes.

## Server-Side Code

Server-side code uses `$` and `sub` from `'startupjs'` for data access. However, private collections like `$._session` are NOT available on the server. Instead, the user ID is on the request session object as `req.session.userId`:

```js
import { $, sub } from 'startupjs'

async function isLoggedIn (req, res, next) {
  const userId = req.session.userId
  if (!userId) return res.sendStatus(403)
  const $user = await sub($.users[userId])
  if (!$user.get()) return res.sendStatus(403)
  next()
}
```

## Common Mistakes (DO NOT)

1. **Do NOT use `.id` to get document IDs** — use `.getId()` instead
2. **Prefer `startupjs-ui` over `react-native`** — use `Div` not `View`, `Span` not `Text`. Only use `react-native` for things not available in `startupjs-ui`
3. **Do NOT read database signals without subscribing** — always use `useSub` or `sub` first
4. **Do NOT forget `observer()`** — wrap every component by default, not just those reading signals
5. **Do NOT use `useState`/`useEffect` for reactive data** — use signals (`$()`) and `observer` instead
6. **Do NOT place raw text inside `Div`** — always wrap text in `Span`
7. **Do NOT use inline `style` for normal layout/styling** — use `styleName` and define styles in a top-level `style(lang='styl')` block inside the returned `pug` template. Only use `style` for truly dynamic JS values
8. **Do NOT use `px` for spacing** — use `u` units (1u = 8px, 0.5u = 4px) to follow the 8px grid
9. **Do NOT use JSX** — use `pug` tagged template strings for all templates
10. **Do NOT pass raw values to child components** — pass signals instead. Call `.get()` only when you need the raw value for display or logic, not when passing data to children
11. **Do NOT write new app code in plain JavaScript** — use TypeScript for all app code. Keep `startupjs.config.js` as plain ESM JavaScript

## Quick Reference

```js
// Complete example: a todo list component
import { observer, $, useSub, pug } from 'startupjs'
import { Button, Card, Checkbox, Content, Div, ScrollView, Span, TextInput } from 'startupjs-ui'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default observer(function TodoList () {
  const $todos = useSub($.todos, {})
  const $newTitle = $('')

  async function addTodo () {
    const title = $newTitle.get().trim()
    if (!title) return
    await $.todos.add({ title, completed: false })
    $newTitle.set('')
  }

  return pug`
    ScrollView(full)
      Content(padding)
        Span(h1) TODO List

        Div.inputRow(row vAlign='center')
          TextInput.input(
            value=$newTitle.get()
            onChangeText=value => $newTitle.set(value)
            placeholder='What needs to be done?'
          )
          Button(onPress=addTodo) Add

        each $todo in $todos
          Card(key=$todo.getId())
            Div(row align='between' vAlign='center')
              Checkbox(
                value=$todo.completed.get()
                onChange=value => $todo.completed.set(value)
              )
              Span(styleName=['todoTitle', { completed: $todo.completed.get() }])
                = $todo.title.get()
              Button(
                icon=faTimes
                iconColor='error'
                size='s'
                onPress=() => $todo.del()
              )
    style(lang='styl')
      .inputRow
        margin-bottom 1u
      .input
        flex 1
        margin-right 1u
      .todoTitle
        &.completed
          text-decoration line-through
          color #999
  `
})
```
