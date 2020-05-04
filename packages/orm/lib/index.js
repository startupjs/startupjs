const Model = require('racer').Model
const promisifyRacer = require('./promisifyRacer')

module.exports = exports = function (racer) {
  if (racer.orm) return

  racer._orm = {}

  racer.orm = function (pattern, OrmEntity, alias) {
    var name = alias || pattern
    if (racer._orm[name]) throw alreadyDefinedError(pattern, alias)
    racer._orm[name] = {
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

  Model.prototype.scope = function (path, alias) {
    if (alias) {
      if (racer._orm[alias]) {
        return this.__createScopedModel(path, racer._orm[alias].OrmEntity)
      } else {
        throw new Error(
          'Non-existent alias of the OrmEntity specified: ' + alias + '\n\n' +
          'Most likely you have specified the path incorrectly in ' +
          '".scope()" or ".at()"\n\n' +
          'The path must be passed as a single string separated by dots, ' +
          'for example:\n\n' +
          'CORRECT:\n' +
          '$root.at(\'users.\' + userId)\n\n' +
          'INCORRECT:\n' +
          '$root.at(\'users\', userId)'
        )
      }
    }

    var segments = this._dereference(this.__splitPath(path), true)
    var fullPath = segments.join('.')

    for (var name in racer._orm) {
      var regexp = racer._orm[name].regexp
      if (regexp.test(fullPath)) {
        return this.__createScopedModel(path, racer._orm[name].OrmEntity)
      }
    }

    return this._scope(path)
  }

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
    msg = 'ORM entity with the alias \'' + alias + '\' is already defined. ' +
      'Aliases must be unique. If you did already define the same ORM entity with ' +
      'that alias name, just don\'t specify the alias at all -- path pattern is sufficient.'
  } else {
    msg = 'ORM entity matching the same path pattern \'' + pattern + '\' is already defined.'
  }
  return new Error(msg)
}

exports.ChildModel = Model.ChildModel

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
  var model = this.root
  var actualField = this.dereferenceSelf()
  return model._splitPath(actualField.path())[0]
}

BaseModel.prototype.dereferenceSelf = function () {
  var model = this.root
  var segments = model._splitPath(this.path())
  return model.scope(model._dereference(segments, true).join('.'))
}

exports.BaseModel = BaseModel
