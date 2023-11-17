import racer from 'racer'
import Query from 'racer/lib/Model/Query.js'

const Model = racer.Model

// Methods to fix to properly handle (value, ..., cb) pair
const FIX_VALUE_CB = {
  // mutators
  set: { minArgs: 2 },
  setNull: { minArgs: 2 },
  setEach: { minArgs: 2 },
  push: { minArgs: 2 },
  unshift: { minArgs: 2 },
  insert: { minArgs: 3 },
  remove: { minArgs: 2, onlyValidate: true },
  move: { minArgs: 3, onlyValidate: true },
  stringInsert: { minArgs: 3, onlyValidate: true },
  stringRemove: { minArgs: 3, onlyValidate: true },
  subtypeSubmit: { minArgs: 3, onlyValidate: true },
  // setDiffs
  setDiff: { minArgs: 2 },
  setDiffDeep: { minArgs: 2 },
  setArrayDiff: { minArgs: 2 },
  setArrayDiffDeep: { minArgs: 2 }
}
const MUTATORS = [
  // ref: https://github.com/derbyjs/racer/blob/master/lib/Model/mutators.js
  'set',
  'setNull',
  'setEach',
  'create',
  'createNull',
  'add',
  'del',
  'increment',
  'push',
  'unshift',
  'insert',
  'pop',
  'shift',
  'remove',
  'move',
  'stringInsert',
  'stringRemove',
  'subtypeSubmit',
  // ref: https://github.com/derbyjs/racer/blob/master/lib/Model/setDiff.js
  'setDiff',
  'setDiffDeep',
  'setArrayDiff',
  'setArrayDiffDeep'
]
const SUBSCRIPTIONS = [
  'subscribe',
  'fetch'
]
const ASYNC_METHODS = MUTATORS.concat(SUBSCRIPTIONS)

export default function () {
  for (const method in FIX_VALUE_CB) {
    const { minArgs, onlyValidate } = FIX_VALUE_CB[method]
    Model.prototype[method] = fixValueCbApi(
      Model.prototype[method], method, minArgs, onlyValidate
    )
  }

  for (const method of ASYNC_METHODS) {
    Model.prototype[method] = optionalPromisify(Model.prototype[method])
    Model.prototype[method + 'Async'] = deprecationWarning(
      Model.prototype[method], method
    )
  }

  for (const method of SUBSCRIPTIONS) {
    Query.prototype[method] = optionalPromisify(Query.prototype[method])
    Query.prototype[method + 'Async'] = deprecationWarning(
      Query.prototype[method], method
    )
  }
}

function optionalPromisify (originalFn) {
  return function optionalPromisifier (...args) {
    if (typeof args[args.length - 1] === 'function') {
      return originalFn.apply(this, args)
    } else {
      return new Promise((resolve, reject) => {
        // Append the callback
        let syncResult // eslint-disable-line
        let isSyncCallback = true
        args.push(function promisifyCallback (err, value) {
          if (err) return reject(err)
          if (value) return resolve(value)
          if (isSyncCallback) {
            // When modifying local collection, result is returned immediately,
            // so we have to hack it to return async to save the sync result.
            process.nextTick(() => resolve(syncResult))
          } else {
            return resolve(syncResult)
          }
        })
        syncResult = originalFn.apply(this, args)
        isSyncCallback = undefined
      }).catch(err => {
        console.error(err)
        if (this instanceof Query) {
          this.model.root.emit('error', err)
        } else {
          this.root.emit('error', err)
        }
      })
    }
  }
}

function fixValueCbApi (originalFn, methodName, minArgs, onlyValidate) {
  return function (...args) {
    // perform op on current path when (value, [...], function) is passed
    if (typeof arguments[arguments.length - 1] === 'function') {
      if (arguments.length < minArgs) {
        throw new Error('Not enough arguments for ' + methodName)
      } else if (!onlyValidate && arguments.length === minArgs) {
        args.unshift('')
      }
    }
    return originalFn.apply(this, args)
  }
}

function deprecationWarning (originalFn, methodName) {
  return function () {
    console.warn(
      'model.' + methodName + 'Async() is DEPRECATED and going to be ' +
      'REMOVED soon!\n Please use ' + methodName + '(), ' +
      'it supports promises now and you can \'await\' it directly.'
    )
    return originalFn.apply(this, arguments)
  }
}
