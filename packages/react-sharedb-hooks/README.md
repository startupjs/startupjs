# startupjs react-sharedb-hooks

> Run `ShareDB` in `React` using Hooks syntax.

## What it does

1. Brings real-time collaboration to React using [ShareDB](https://github.com/share/sharedb);
2. Uses [Racer](https://derbyjs.com/docs/derby-0.10/models) to add a `model`
   to your app to do any data manipulations;
3. The `model` acts as a global singleton state, so you can use it as a
   replacement for other state-management systems like `Redux` or `MobX`;
4. Makes the `render` reactive similar to how it's done in `MobX` --
   rerendering happens whenever any `model` data you used in `render`
   changes.

## Installation

It's recommended to just use `startupjs` package, since it proxies the API of `@startupjs/react-sharedb`.

```
yarn add startupjs
```

## Usage with Hooks

### `observer(FunctionalComponent, options)` HOF

Higher Order Function which makes your functional component rendering reactive.
**You have to** wrap your functional components in it to be able to use `react-sharedb` hooks.

`options` object have the following properties:
* `forwardRef` - pass `true` to use `React.forwardRef` over the inner component
* `suspenseProps`
  * `fallback` - A React element (ie. `<MyComponent />`)

```js
import {observer, useDoc} from 'startupjs'

export default observer(function User ({userId}) {
  let [user, $user] = useDoc('users', userId)
  return (
    <input value={user.name} onChange={e => $user.set('name', e.target.value)} />
  )
})
```

### `useDoc(collection, docId)`

Subscribe to the particular Mongo document by id.

`collection` \[String\] -- collection name. Required

`docId` \[String\] -- document id. Required

**Returns:** `[doc, $doc]`, where:

`doc` \[Object\] -- value of document

`$doc` \[Model\] -- scoped model targeting path `collection.docId`

**Example:**

```js
import React from 'react'
import { observer, useDoc } from 'startupjs'

export default observer(function Room ({
  roomId = 'DUMMY_ID'
}) {
  let [room, $room] = useDoc('rooms', roomId)

  // If the document with an `_id` of `roomId` doesn't exist yet, we create it.
  // We have to wait for the document to be created by throwing the promise.
  if (!room) throw $room.createAsync({ title: 'New Room' })

  function onChange (e) {
    $room.set('title', e.target.value)
  }

  return <input onChange={onChange} value={room.title} />
})
```

**IMPORTANT:** The id of the document is stored internally in Mongo inside the `_id` field.
But when it gets into the model, it gets replaced with the `id` field instead, and vice versa.

### `useQuery(collection, query)`

Subscribe to the Mongo query.

`collection` \[String\] -- collection name. Required

`query` \[Object\] -- query (regular, `$count`, `$aggregate` queries are supported). Required

**Returns:** `[docs, $docs]`, where:

`docs` \[Array\] -- array of documents

`$docs` \[Model\] -- scoped model targeting the whole `collection`

**Example:**

```js
let [users, $users] = useQuery('users', { roomId: props.roomId, anonymous: false })
```

**IMPORTANT:** The scoped model `$docs`, which you receive from the hook, targets the global collection path.
You can use it to easily reach a document with a particular id using scoped models:

```js
let [users, $users] = useQuery('users', { roomId, anonymous: false })
for (let user of users) {
  $users.at(user.id).setEach({
    joinedRoom: true,
    updatedAt: Date.now()
  })
}
```

### `useQueryIds(collection, ids, options)`

Subscribe to documents in collection by their ids

`collection` \[String\] -- collection name. Required

`ids` \[Array\] -- array of strings which should be document ids.

`options` \[Object\] --

    ```js
    {
      reverse: false // reverse the order of resulting array
    }
    ```

**Example:**

```js
export default observer(function Players ({ gameId }) {
  let [game] = useDoc('games', gameId)
  let [players, $players] = useQueryIds('players', game.playerIds)

  return (
    <div>{players.map(i => i.name).join(' ,')}</div>
  )
})
```

### `useQueryDoc(collection, query)`

Subscribe to a document using a query. It's the same as `useDoc()`, but
with `query` parameter instead of the particular `docId`.
`$limit: 1` and `$sort: { createdAt: -1 }` are added to the query automatically (if they don't already exist).

`collection` \[String\] -- collection name. Required

`query` \[Object\] -- query object, same as in `useQuery()`.

**Example:**

```js
export default observer(function NewPlayer ({ gameId }) {
  // { $sort: { createdAt: -1 }, $limit: 1 }
  // is added automatically to the query, so the newest player will be returned.
  // It's also reactive, so whenever a new player joins, you'll receive the new data and model.
  let [newPlayer, $newPlayer] = useQueryDoc('players', { gameId })
  if (!newPlayer) return null // <Loading />

  return (
    <div>New player joined: {newPlayer.name}</div>
  )
})
```

### `useLocal(path)`

Subscribe to the data you already have in your local model by path.

You will usually use it to subscribe to private collections like `_page` or `_session`.
This is very useful when you want to share the state between multiple components.

It's also possible to subscribe to the path from a public collection, for example when you
want to work with some nested value of a particular document you have already subscribed to.

**Returns:** `[value, $value]`, where:

`value` \[any\] -- data, located on that `path`

`$value` \[Model\] -- model, targeting that `path`

**Example:**

```js
const SIDEBAR_OPENED = '_page.Sidebar.opened'

const Topbar = observer(() => {
  let [sidebarOpened, $sidebarOpened] = useLocal(SIDEBAR_OPENED)
  return <>
    <button
      onClick={() => $sidebarOpened.set(!sidebarOpened)}
    >Toggle Sidebar</button>
  </>
})

const Sidebar = observer(() => {
  let [sidebarOpened] = useLocal(SIDEBAR_OPENED)
  return sidebarOpened ? <p>Sidebar</p> : null
})

const App = observer(() => {
  return <>
    <Topbar />
    <Sidebar />
  </>
})
```

### `useSession(path)`

A convenience method to access the `_session` local collection.

```js
let [userId, $userId] = useSession('userId')
// It's the same as doing:
let [userId, $userId] = useLocal('_session.userId')
```

### `usePage(path)`

A convenience method to access the `_page` local collection.

**Example:**

```js
let [game, $game] = usePage('game')
// It's the same as doing:
let [game, $game] = useLocal('_page.game')
```

### `useValue(defaultValue)`

An observable alternative to `useState`.

**Example:**

```js
const DEFAULT_USER = {
  first: 'John',
  last: 'Smith',
  address: 'Washington St.'
}

const Field = observer(({ label, $value }) => {
  return <div>
    <span>{label}: </span>
    <input value={$value.get()} onChange={e => $value.set(e.target.value)} />
  </div>
})

const User = observer(() => {
  let [user, $user] = useValue(DEFAULT_USER)

  return <>
    <Field label='First' $value={$user.at('first')} />
    <Field label='Last' $value={$user.at('last')} />
    <Field label='Address' $value={$user.at('address')} />
    <code>{user}</code>
  </>
})
```

### `useModel(path)`

Return a model scoped to `path` (memoized by the `path` argument).
If `path` is not provided, returns the model scoped to the root path.

**Example:**

```js
import React from 'react'
import {render} from 'react-dom'
import {observer, useModel, useLocal} from 'startupjs'

const Main = observer(() => {
  return (
    <div style={{display: 'flex'}}>
      <Content />
      <Sidebar />
    </div>
  )
})

const Content = observer(() => {
  let $showSidebar = useModel('_page.Sidebar.show')

  // sidebar will be opened without triggering rerendering of the <Content /> component (this component)
  return (
    <div>
      <p>I am Content</p>
      <button onClick={() => $showSidebar.setDiff(true)}>Open Sidebar</button>
    </div>
  )
})

const Sidebar = observer(() => {
  let [show, $show] = useLocal('_page.Sidebar.show')
  if (!show) return null
  return (
    <div>
      <p>I am Sidebar</p>
      <button onClick={() => $show.del()}>Close</button>
    </div>
  )
})

render(<Main />, document.body.appendChild(document.createElement('div')))
```

### Batching

By default, React batches updates made in a known method like the lifecycle methods or event handlers, but doesn’t do the same when the updates are within callbacks like in SetTimeout, Promises, etc. This means that if you have multiple calls to update the state, React re-renders the component each time the call is made.

For model methods you can use `batch` and for React `useState` methods you can use `ReactDOM.unstable_batchedUpdates`.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { observer, batch, useDoc } from 'startupjs'

export default observer(function Game ({ gameId }) {
  const [isStarted, setIsStarted] = useState(false)
  const [startAt, setStartAt] = useState()

  function startGame () {
    const startAt = +new Date()

    Promise.resolve().then(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        setIsStarted(true)
        setStartAt(startAt)
      })
    })

    // then all mutation will be batched
    // until setTimeout, Promise, etc comes up

    const $$players = $root.query('players', { gameId })
    // waiting for promise
    // it is the same as Promise.resolve().then(...)
    // it means all next mutation will be not batched
    await $root.subscribe($$players)
    const playerIds = $$players.getIds()
    const promises = []

    // batch all next mutation
    batch(() => {
      playerIds.forEach(playerId => {
        const $player = $root.scope(`players.${playerId}`)
        promises.push($player.setAsync('startAt', startAt))
      })
    })

    await Promise.all(promises)
  }

  return (
    <button onClick={startGame}>Start game</button>
  )
```

### Hooks Example

```js
import React from 'react'
import {observer, useDoc, useQuery, useLocal, useValue} from 'startupjs'

export default observer(function Game ({gameId}) {
  let [secret, $secret] = useValue('Game Secret Password')
  let [userId, $userId] = useLocal('_session.userId')
  let [user, $user] = useDoc('users', userId)
  let [game, $game] = useDoc('games', gameId)
  let [players, $players] = useQuery('players', {_id: {$in: game.playerIds}})
  let [users, $users] = useQuery('users', {_id: {$in: players.map(i => i.userId)}})

  function updateSecret (event) {
    $secret.set(event.target.value)
  }

  function updateName (event) {
    $user.set('name', event.target.value)
  }

  return (
    <div>
      <label>
        Secret:
        <input type='text' value={code} onChange={updateSecret} />
      </label>

      <label>
        My User Name:
        <input type='text' value={user.name} onChange={updateName} />
      </label>

      <h1>Game {game.title}</h1>

      <h2>Users in game:</h2>
      <p>{users.map(i => i.name).join(', ')}</p>
    </div>
  )
})
```

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
