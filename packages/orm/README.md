# racer-orm
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
import { promisifyAll } from 'bluebird'

// Promisify the default model methods like subscribe, fetch, set, push, etc.
promisifyAll(Model.prototype)


class PlayerModel extends Model.ChildModel {
  alert (message) {
    this.set('alert', this.get('name') + ', ' + message)
    this.setDiff('showAlert', true)
  }
}

class GamesModel extends Model.ChildModel {
  async addNew (userId = 'system', params = {}) {
    let gameId = this.id()
    await this.addAsync('games', {      
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
    await this.subscribeAsync(playersQuery)
    for (let playerId of playersQuery.getIds()) {
      this.scope('players.' + playerId).alert(message)
    }
  }
  
  async addPlayer (userId, params = {}) {
    if (!userId) throw new Error('userId required')
    var playerId = this.id()
    await this.root.addAsync('players', {      
      ...params,
      id: playerId,      
      userId,
      createdAt: Date.now()
    })
    await this.pushAsync('playerIds', playerId)
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

## Licence

MIT

(c) Decision Mapper - http://decisionmapper.com
