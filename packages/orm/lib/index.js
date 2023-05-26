import racer from 'racer'
import promisifyRacer from './promisifyRacer'
import { singletonMemoize } from '@startupjs/cache'

const Model = racer.Model

global.STARTUP_JS_ORM = {}

export default function (racer) {
  if (racer.orm) return

  racer._orm = global.STARTUP_JS_ORM
  racer.orm = function (pattern, OrmEntity, alias) {
    var name = alias || pattern
    if (global.STARTUP_JS_ORM[name]) throw alreadyDefinedError(pattern, alias)

    // NOTE
    // if same OrmEntity will be passed for different collections
    // then they will all have the same collection name
    if (!OrmEntity.collection) {
      var match = pattern.match(/^[^.]+/)
      if (match) OrmEntity.collection = match[0]
    }

    global.STARTUP_JS_ORM[name] = {
      pattern: pattern,
      regexp: patternToRegExp(pattern),
      OrmEntity: OrmEntity
    }
  }

  Model.prototype.at = function (subpath, alias) {
    var path = this.path(subpath)
    return this.scope(path, alias)
  }

  Model.prototype._scope = function (path) {
    var ChildModel = Model.ChildModel
    var model = new ChildModel(this)
    model._at = path
    return model
  }

  // TODO: do NOT cache within built-in use* hooks from react-sharedb
  //       because they already handle caching internally
  Model.prototype.scope = singletonMemoize(function (path, alias) {
    if (alias) {
      if (global.STARTUP_JS_ORM[alias]) {
        return this.__createScopedModel(path, global.STARTUP_JS_ORM[alias].OrmEntity)
      } else {
        throw new Error(
          'Non-existent alias of the OrmEntity specified: ' +
            alias +
            '\n\n' +
            'Most likely you have specified the path incorrectly in ' +
            '".scope()" or ".at()"\n\n' +
            'The path must be passed as a single string separated by dots, ' +
            'for example:\n\n' +
            'CORRECT:\n' +
            "$root.at('users.' + userId)\n\n" +
            'INCORRECT:\n' +
            "$root.at('users', userId)"
        )
      }
    }

    var segments = this._dereference(this.__splitPath(path), true)
    var fullPath = segments.join('.')

    for (var name in global.STARTUP_JS_ORM) {
      var regexp = global.STARTUP_JS_ORM[name].regexp
      if (regexp.test(fullPath)) {
        return this.__createScopedModel(path, global.STARTUP_JS_ORM[name].OrmEntity)
      }
    }

    return this._scope(path)
  }, {
    cacheName: 'model',
    nestedThis: true
  })

  Model.prototype.__createScopedModel = function (path, OrmEntity) {
    var model
    if (OrmEntity.factory || OrmEntity.prototype.factory) {
      model = OrmEntity(this._scope(path), this)
      // if factory didn't return anything, return a simple scoped model
      if (!model) model = this._scope(path)
    } else {
      model = new OrmEntity(this)
    }
    model._at = path
    return model
  }

  Model.prototype.__splitPath = function (path) {
    return (path && path.split('.')) || []
  }

  promisifyRacer()
}

function patternToRegExp (pattern) {
  pattern = pattern.replace(/\$/g, '\\$').replace(/\./g, '\\.').replace(/\*/g, '([^\\.]*)')
  return new RegExp('^' + pattern + '$')
}

function alreadyDefinedError (pattern, alias) {
  var msg
  if (alias) {
    msg =
      "ORM entity with the alias '" +
      alias +
      "' is already defined. " +
      'Aliases must be unique. If you did already define the same ORM entity with ' +
      "that alias name, just don't specify the alias at all -- path pattern is sufficient."
  } else {
    msg = "ORM entity matching the same path pattern '" + pattern + "' is already defined."
  }
  return new Error(msg)
}

export const ChildModel = Model.ChildModel

function BaseModel () {
  Model.ChildModel.apply(this, arguments)
}

BaseModel.prototype = Object.create(Model.ChildModel.prototype)
BaseModel.prototype.constructor = BaseModel

BaseModel.prototype.getId = function () {
  var actualField = this.dereferenceSelf()
  return actualField.leaf()
}

BaseModel.prototype.getCollection = function () {
  let collection = this.constructor.collection

  // fallback when orm is factory
  if (!collection) {
    const model = this.root
    const actualField = this.dereferenceSelf()
    collection = model._splitPath(actualField.path())[0]
  }

  return collection
}

BaseModel.prototype.dereferenceSelf = function () {
  var model = this.root
  var segments = model._splitPath(this.path())
  return model.scope(model._dereference(segments, true).join('.'))
}

BaseModel.associations = []

BaseModel.addAssociation = function (association) {
  this.associations = this.associations.concat(association)
}

BaseModel.prototype.getAssociations = function () {
  return this.constructor.associations
}

export { BaseModel }
export * from './associations'
