import { BaseModel } from 'startupjs/orm'
import initI18nModel from 'startupjs/i18n/model'

export default function (racer) {
  initI18nModel(racer)

  racer.orm('users.*', UserModel)
  racer.orm('service.*', ServiceModel)
  racer.orm('players.*', PlayerFactory)
}

class ServiceModel extends BaseModel {
  static access = {
    create: async (model, collection, docId, doc, session) => { return true },
    read: async (model, collection, docId, doc, session) => { return true },
    update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { return true },
    delete: async (model, collection, docId, doc, session) => { return true }
  }
}

class UserModel extends BaseModel {
  static schema = {
    name: {
      type: 'string',
      maxLength: 3
    }
  }

  static access = {
    create: async (model, collection, docId, doc, session) => { return true },
    read: async (model, collection, docId, doc, session) => { return true },
    update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { return true },
    delete: async (model, collection, docId, doc, session) => { return true }
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

class BasePlayerModel extends BaseModel {
  static access = {
    create: async (model, collection, docId, doc, session) => { return true },
    read: async (model, collection, docId, doc, session) => { return true },
    update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { return true },
    delete: async (model, collection, docId, doc, session) => { return true }
  }

  getColor () {
    throw new Error('Player color is unknown')
  }
}

class AlliedPlayerModel extends BasePlayerModel {
  static access = {
    create: async (model, collection, docId, doc, session) => { return true },
    read: async (model, collection, docId, doc, session) => { return true },
    update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { return true },
    delete: async (model, collection, docId, doc, session) => { return true }
  }

  getColor () {
    return 'blue'
  }
}

class RivalPlayerModel extends BasePlayerModel {
  static access = {
    create: async (model, collection, docId, doc, session) => { return true },
    read: async (model, collection, docId, doc, session) => { return true },
    update: async (model, collection, docId, oldDoc, session, ops, newDoc) => { return true },
    delete: async (model, collection, docId, doc, session) => { return true }
  }

  getColor () {
    return 'red'
  }
}
