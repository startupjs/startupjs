# startupjs racer-orm
ORM system for Racer.js and ShareDB

## What it does

Lets you automatically override your scope models
(created with `.at()` and `.scope()`) with the additional methods.

## Usage

Add the plugin:

```js
import Racer from 'racer'
import racerOrm from 'racer-orm'
Racer.use(racerOrm)
```

Then start adding the ORM entities to your model.
Each ORM Entity must be inherited from `Model.ChildModel`.

```js

import { Model } from 'racer'

class PlayerModel extends Model.ChildModel {
  alert (message) {
    this.set('alert', this.get('name') + ', ' + message)
    this.setDiff('showAlert', true)
  }
}

class GamesModel extends Model.ChildModel {
  async addNew (userId = 'system', params = {}) {
    let gameId = this.id()
    await this.add('games', {
      name: 'Dummy Game',
      ...params,
      id: gameId,
      userId,
      playerIds: [],
      createdAt: Date.now()
    })
    return gameId
  }
}

class GameModel extends Model.ChildModel {
  async alertPlayers (message) {
    let playerIds = this.get('playerIds')
    let playersQuery = this.root.query('players', { _id: { $in: playerIds } })
    await this.subscribe(playersQuery)
    for (let playerId of playersQuery.getIds()) {
      this.scope('players.' + playerId).alert(message)
    }
  }

  async addPlayer (userId, params = {}) {
    if (!userId) throw new Error('userId required')
    var playerId = this.id()
    await this.root.add('players', {
      ...params,
      id: playerId,
      userId,
      createdAt: Date.now()
    })
    await this.push('playerIds', playerId)
    return playerId
  }
}

racer.orm('games', GamesModel)
racer.orm('games.*', GameModel)
racer.orm('players.*', PlayerModel)

// ...

async function main ($root) {
  let $games = $root.scope('games')
  let gameId = await $games.addNew('userId1', { name: 'Cool game' })
  let $game = $games.at(gameId)
  for (let userIds of ['userId1', 'userId2', 'userId3']) {
    await $game.addPlayer(userIds)
  }
  $game.alertPlayers('please join the game!')
}

// ...
```

## Factory

Sometimes you want to dynamically decide which ORM to use
based on the document's data. Factory let you do that.

Example:

```js
class BasePlayerModel extends Model.ChildModel {
  getColor () {
    throw new Error('Player color is unknown')
  }
}

class AlliedPlayerModel extends BasePlayerModel {
  getColor () {
    return 'blue'
  }
}

class RivalPlayerModel extends BasePlayerModel {
  getColor () {
    return 'red'
  }
}

function PlayerFactory ($player, $parent) {
  // $player here is going to be just a pure scoped model
  let playerTeamId = $player.get('teamId')
  let $root = $player.root
  let myTeamId = $root.get('_session.myTeamId')

  // you have to always pass `$parent` when manually
  // instantiating the ORM Entity
  if (!playerTeamId || !myTeamId) return new BasePlayerModel($parent)

  if (playerTeamId === myTeamId) {
    return new AlliedPlayerModel($parent)
  } else {
    return new RivalPlayerModel($parent)
  }
}
PlayerFactory.factory = true

racer.orm('players.*', PlayerFactory)
```

## Alias

You can optionally specify an alias for the ORM Entity:

```js
racer.orm('players.*', PlayerModel, 'Player')
```

This will allow you to explicitly specify in `.at()` and `.scope()`
which ORM Entity to use even for the unknown path patters:

```js
let playerId = 'playerId1'
// will create the PlayerModel, since it matches the specified path pattern:
model.scope('players.' + playerId).alert('please join the game!')

// The following will also create the PlayerModel
// even though '_session.myPlayer' wasn't specified in the orm path patterns:
model.scope('_session.myPlayer', 'Player').alert('please join the game!')
```

**IMPORTANT:** Note, that this is a bad practice and must only be used in the edge cases.

It's always better to list all your path patterns explicitly and don't use aliases at all:

```js
racer.orm('players.*', PlayerModel)
racer.orm('_session.myPlayer', PlayerModel)
racer.orm('_session.rivalPlayer', PlayerModel)
```
## [JSON Schema](https://json-schema.org/understanding-json-schema/) validation of documents.

## Associations decorators

Association allow you to describe relationships between ORM entities for reuse in your code.

### `belongsTo(AssociatedOrmEntity, options)`

Specifies a one-to-one association with another ORM entity. This decorator should only be used if this ORM entity contains the foreign key.

`AssociatedOrmEntity (OrmEntityClass)`: associated orm entity

`options (Object)`:
* `key`: foreign key name (default: `collection + 'Id'`)
* any other custom properties

### `hasOne(AssociatedOrmEntity, options)`

Specifies a one-to-one association with another ORM entity. This decorator should only be used if the other ORM entity contains the foreign key.

`AssociatedOrmEntity (OrmEntityClass)`: associated orm entity

`options (Object)`:
* `key`: foreign key name (default: `collection + 'Id'`)
* any other custom properties

### `hasMany(AssociatedOrmEntity, options)`
Is similar to `hasOne`, but indicates a one-to-many association with another ORM entity.

`AssociatedOrmEntity (OrmEntityClass)`: associated orm entity

`options (Object)`:
* `key`: foreign key name (default: `collection + 'Ids'`)
* any other custom properties

```js
import { BaseModel, hasMany, hasOne, belongsTo } from 'startupjs/orm'
import GamesModel from './GamesModel'
import GameModel from './GameModel'
import PlayerModel from './PlayerModel'

racer.orm('games', GamesModel)
racer.orm('games.*', hasMany(PlayerModel)(GameModel))
racer.orm('players.*', PlayerModel)
```

## Installation

1. in `server/index.js` add `validateSchema: true` to `startupjsServer()` options
2. Go to one of your ORM document entities (for example, `UserModel`, which targets `users.*`) and add a static method `schema`:

```js
import { BaseModel } from 'startupjs/orm'

export default class UserModel extends BaseModel {
  static schema = {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    age: {
      type: 'number',
      multipleOf: 1,
      minimum: 0,
      maximum: 130
    }
  }
}
```

## Notes

1. Schema is checked on both client-side and server-side.
2. Schema validation only works in development. So there won't be any performance overheads when `NODE_ENV` is `production`
3. Only ORMs targeting documents path `<collection>.*` are gonna be parsed for `schema` definitions.

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
