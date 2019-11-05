import isArray from 'lodash/isArray'
import uniq from 'lodash/uniq'
import union from 'lodash/union'
import keys from 'lodash/keys'
import isEqual from 'lodash/isEqual'
// import debounce from 'lodash/debounce'
import racer from 'racer'
import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import model from '@startupjs/model'
import Doc from './types/Doc'
import Query from './types/Query'
import QueryExtra from './types/QueryExtra'
import Local from './types/Local'
import Value from './types/Value'
import Api from './types/Api'
import batching from './batching'
import RacerLocalDoc from 'racer/lib/Model/LocalDoc'
import RacerRemoteDoc from 'racer/lib/Model/RemoteDoc'
import RacerUtil from 'racer/lib/util'
import RacerQuery from 'racer/lib/Model/Query'
import SharedbDoc from 'sharedb/lib/client/doc'
import semaphore from './semaphore'
import { isExtraQuery } from './util'
import {
  observe,
  unobserve,
  observable,
  isObservable
} from '@nx-js/observer-util'

const STORE = 'store'
const STORE_DEPRECATED = 'scope'
const $STORE = '$' + STORE
const $STORE_DEPRECATED = '$' + STORE_DEPRECATED
const DEFAULT_COLLECTION = '$components'
const SUBSCRIBE_COMPUTATION_NAME = '__subscribeComputation'
const HELPER_METHODS_TO_BIND = ['get', 'at']
const DUMMY_STATE = {}

export default function subscribe (fn) {
  return function decorateTarget (Component) {
    const isStateless = !(
      Component.prototype && Component.prototype.isReactComponent
    )
    let AutorunComponent = Component.__isSubscription
      ? Component
      : getAutorunComponent(Component, isStateless)
    let SubscriptionsContainer = getSubscriptionsContainer(
      AutorunComponent,
      fn ? [fn] : []
    )
    return hoistStatics(SubscriptionsContainer, AutorunComponent)
  }
}

const getAutorunComponent = (Component, isStateless) => {
  class AutorunHOC extends (isStateless ? React.Component : Component) {
    constructor (props, ...args) {
      super(props, ...args)

      // Mark subscription as used.
      // This is needed to track in later @subscribe's whether
      // to create a new $STORE or use the one received from props
      // (in case when the outer component is @subscribe)
      props[$STORE].__used = true

      // let fn = debounce(() => {
      //   if (this.unmounted) return
      //   this.setState(DUMMY_STATE)
      // })

      let updateFn = () => {
        if (this.unmounted) return
        this.setState(DUMMY_STATE)
      }
      this.update = () => batching.add(updateFn)

      // let fn = () => batchedUpdate(() => {
      //   if (this.unmounted) return
      //   this.setState(DUMMY_STATE)
      // })

      // create a reactive render for the component
      // run a dummy setState to schedule a new reactive render, avoid forceUpdate
      this.render = observe(this.render, {
        scheduler: this.update,
        lazy: true
      })
    }

    render () {
      return isStateless ? Component(this.props, this.context) : super.render()
    }

    componentWillUnmount () {
      this.unmounted = true
      // stop autorun
      unobserve(this.render)
      // call user defined componentWillUnmount
      if (super.componentWillUnmount) super.componentWillUnmount()
    }
  }
  AutorunHOC.displayName = `AutorunHOC(${Component.displayName ||
    Component.name ||
    'Component'})`
  return AutorunHOC
}

const getSubscriptionsContainer = (DecoratedComponent, fns) =>
  class SubscriptionsContainer extends React.Component {
    static __isSubscription = true

    componentWillMount () {
      this.model = this.getOrCreateModel()
      this.models = {}
      // pipe the local model into props as $STORE
      this.models[$STORE] = this.model
      this.models[$STORE_DEPRECATED] = this.model // TODO: DEPRECATED
      this[STORE] = this.model.get()
      this.autorunSubscriptions()
    }

    // TODO: Implement queueing
    async componentWillReceiveProps (...args) {
      let [nextProps] = args
      for (let dataFn of this.dataFns) {
        await dataFn(nextProps)
        if (this.unmounted) return
        if (this.doForceUpdate) {
          this.doForceUpdate = false
          this.setState(DUMMY_STATE)
        }
      }
    }

    // TODO: Maybe throw an error when passing used $STORE to new @subscribe
    getOrCreateModel () {
      if (this.props[$STORE] && !this.props[$STORE].__used) {
        return this.props[$STORE]
      } else {
        let model = generateScopedModel()
        semaphore.allowComponentSetter = true
        model.set('', observable({})) // Initially set empty object for observable
        semaphore.allowComponentSetter = false
        bindMethods(model, HELPER_METHODS_TO_BIND)
        return model
      }
    }

    componentWillUnmount () {
      this.unmounted = true

      // Stop all subscription params computations
      for (let index = 0; index < this.dataFns.length; index++) {
        let computationName = getComputationName(index)
        this.comps[computationName] && unobserve(this.comps[computationName])
        delete this.comps[computationName]
      }
      delete this.dataFns

      // Destroy whole model before destroying items one by one.
      // This prevents model.on() and model.start() from firing
      // extra times
      semaphore.allowComponentSetter = true
      this.model.destroy()
      semaphore.allowComponentSetter = false

      // Destroy all subscription items
      for (let key in this.items) {
        this.destroyItem(key, true, true)
      }

      for (let key in this.models) {
        delete this.models[key]
      }
      delete this.models
      delete this[STORE]
      delete this.model // delete the actual model
    }

    render () {
      this.rendered = true
      if (this.loaded) {
        return React.createElement(DecoratedComponent, {
          ...this.props,
          [STORE]: this[STORE],
          [STORE_DEPRECATED]: this[STORE], // TODO: DEPRECATED
          ...this.models,
          ref: (...args) => {
            if (!DecoratedComponent.__isSubscription) {
              if (this.props.innerRef) this.props.innerRef(...args)
            }
          }
        })
      } else {
        // When in React Native env, don't use any loading spinner
        if (
          typeof navigator !== 'undefined' &&
          navigator.product === 'ReactNative'
        ) {
          return null
        } else {
          return React.createElement('div', { className: 'Loading' })
        }
      }
    }

    // TODO: When we change subscription params quickly, we are going to
    //       receive a race condition when earlier subscription result might
    //       take longer to process compared to the same newer subscription.
    //       Implement Queue.
    async autorunSubscriptions () {
      this.items = {}
      this.comps = {}
      this.dataFns = []
      for (let index = 0; index < fns.length; index++) {
        let fn = fns[index]
        let subscriptions = {}
        let dataFn = async props => {
          // When there are multiple @subscribe's, the outermost
          // is going to destroy the model.
          // This check makes sure that inner @subscribe's don't
          // fire in that case.
          if (!this.model.get()) return

          let prevSubscriptions = subscriptions || {}
          let computationName = getComputationName(index)
          let subscribeFn = () => {
            subscriptions = fn.call(
              this,
              typeof props === 'function' ? this.props : props
            )
          }

          this.comps[computationName] && unobserve(this.comps[computationName])
          this.comps[computationName] = observe(subscribeFn, {
            scheduler: dataFn
          })

          let keys = union(keys(prevSubscriptions), keys(subscriptions))
          keys = uniq(keys)
          let promises = []
          batching.batch(() => {
            for (let key of keys) {
              if (!isEqual(subscriptions[key], prevSubscriptions[key])) {
                if (subscriptions[key]) {
                  promises.push(this.initItem(key, subscriptions[key]))
                } else {
                  this.destroyItem(key, true)
                }
              }
            }
          })
          await Promise.all(promises)
        }
        this.dataFns.push(dataFn)
        await dataFn(this.props)
        if (this.unmounted) return
      }
      // Reset force update since we are doing the initial rendering anyways
      this.doForceUpdate = false
      this.loaded = true
      // Sometimes all the subscriptions might go through synchronously
      // (for example if we are only subscribing to local data).
      // In this case we don't need to manually trigger update
      // since render will execute on its own later in the lifecycle.
      if (this.rendered) this.setState(DUMMY_STATE)
    }

    // TODO: Maybe implement queueing. Research if race condition is present.
    initItem (key, params) {
      let constructor, subscriptionParams
      let explicitType = params && params.__subscriptionType
      if (explicitType) {
        subscriptionParams = params.params
        constructor = getItemConstructor(explicitType)
      } else {
        subscriptionParams = params
        constructor = getItemConstructorFromParams(params)
      }
      let item = new constructor(this.model, key, subscriptionParams)
      // We have to use promises directly here rather than async/await,
      // because we have to prevent async execution of init() if it is not present.
      // But defining the function as `async` will make it run in the next event loop.
      const finishInit = () => {
        if (this.unmounted) return item.destroy()
        batching.batch(() => {
          if (this.items[key]) this.destroyItem(key)
          item.refModel()
          this.items[key] = item
          // Expose scoped model under the same name with prepended $
          let keyModelName = getScopedModelName(key)
          if (!this.models[keyModelName]) {
            this.models[keyModelName] = this.model.at(key)
            this.doForceUpdate = true
          }
        })
      }
      if (item.init) {
        return item
          .init()
          .then(finishInit)
          .catch(err => {
            console.warn(
              "[react-sharedb] Warning. Item couldn't initialize. " +
                'This might be normal if several resubscriptions happened ' +
                'quickly one after another. Error:',
              err
            )
            // Ignore the .init() error
            return Promise.resolve()
          })
      } else {
        finishInit()
        return Promise.resolve()
      }
    }

    // TODO: Refactor to use 3 different facade methods
    destroyItem (key, terminate, modelDestroyed) {
      if (!this.items[key]) return console.error('Trying to destroy', key)
      batching.batch(() => {
        if (!modelDestroyed) this.items[key].unrefModel()
        let keyModelName = getScopedModelName(key)
        if (terminate) {
          delete this[keyModelName]
          this.doForceUpdate = true
        }
        this.items[key].destroy()
      })
      delete this.items[key]
    }
  }

function generateScopedModel () {
  let path = `${DEFAULT_COLLECTION}.${model.id()}`
  return model.scope(path)
}

function getItemConstructor (type) {
  switch (type) {
    case 'Local':
      return Local
    case 'Doc':
      return Doc
    case 'Query':
      return Query
    case 'QueryExtra':
      return QueryExtra
    case 'Value':
      return Value
    case 'Api':
      return Api
    default:
      throw new Error('Unsupported subscription type: ' + type)
  }
}

// TODO: DEPRECATED
function getItemConstructorFromParams (params) {
  console.warn(`
    [react-sharedb] Implicit auto-guessing of subscription type is DEPRECATED and will be removed in a future version.
    Please use explicit \`sub*()\` functions:
      - subDoc(collection, docId)
      - subQuery(collection, query)
      - subLocal(localPath)
      - subValue(value)
  `)
  if (typeof params === 'string') return Local
  if (isArray(params)) {
    let [, queryOrId] = params
    return typeof queryOrId === 'string' || !queryOrId
      ? Doc
      : isExtraQuery(queryOrId) ? QueryExtra : Query
  }
  throw new Error(
    "Can't automatically determine subscription type from params: " + params
  )
}

function getComputationName (index) {
  return `${SUBSCRIBE_COMPUTATION_NAME}${index}`
}

function bindMethods (object, methodsToBind) {
  for (let method of methodsToBind) {
    object[method] = object[method].bind(object)
  }
}

function getScopedModelName (key) {
  return `$${key}`
}

// ----------------------------------------------
//   Monkey patches of ShareDB and Racer
// ----------------------------------------------

// Patch applying sharedb operations to prevent extra rerender from triggering
const oldHandleOp = SharedbDoc.prototype._handleOp
SharedbDoc.prototype._handleOp = function () {
  let value
  batching.batch(() => {
    value = oldHandleOp.apply(this, arguments)
  })
  return value
}

const BATCH_SETTERS = ['_mutate', '_setEach', '_setDiff', '_setDiffDeep']

for (let methodName of BATCH_SETTERS) {
  const oldMethod = racer.Model.prototype[methodName]
  racer.Model.prototype[methodName] = function () {
    let value
    batching.batch(() => {
      value = oldMethod.apply(this, arguments)
    })
    return value
  }
}

const WARNING_SETTERS = ['_set', '_setDiff', '_setNull', '_del']
for (let methodName of WARNING_SETTERS) {
  const oldMethod = racer.Model.prototype[methodName]
  racer.Model.prototype[methodName] = function (segments) {
    if (
      segments.length === 2 &&
      segments[0] === DEFAULT_COLLECTION &&
      !semaphore.allowComponentSetter
    ) {
      throw new Error(
        `You can't use '${methodName.replace(/^_/, '')}' on component's ` +
          `${$STORE} root path. Use 'setEach' instead.`
      )
    }
    return oldMethod.apply(this, arguments)
  }
}

// Monkey patch racer's local documents to be observable
let oldUpdateCollectionData = RacerLocalDoc.prototype._updateCollectionData
RacerLocalDoc.prototype._updateCollectionData = function () {
  if (this.data) this.data = observable(this.data)
  if (
    !semaphore.ignoreCollectionObservableWarning &&
    !isObservable(this.collectionData) &&
    this.collectionName !== '$connection'
  ) {
    console.warn(
      `[react-sharedb] Local collection "${this
        .collectionName}" is not initialized to be observable. ` +
        `Run require("react-sharedb").initLocalCollection("${this
          .collectionName}") before using it anywhere. ` +
        `You must also do it right after cleaning it up with model.silent().destroy("${this
          .collectionName}")`
    )
  }
  return oldUpdateCollectionData.apply(this, arguments)
}

// Monkey patch racer remote doc to make document observable when it's created locally
let oldRemoteDocUpdateCollectionData =
  RacerRemoteDoc.prototype._updateCollectionData
RacerRemoteDoc.prototype._updateCollectionData = function () {
  if (this.shareDoc.data) this.shareDoc.data = observable(this.shareDoc.data)
  return oldRemoteDocUpdateCollectionData.apply(this, arguments)
}

// Monkey patch Racer for additional stuff

racer.Model.prototype.fetchSync = function () {
  var resolve;
  var promise = new Promise(function(r) { resolve = r });
  this._forSubscribable(arguments, 'fetch', resolve, promise);
  return promise;
};

racer.Model.prototype.subscribeSync = function () {
  var resolve;
  var promise = new Promise(function(r) { resolve = r });
  this._forSubscribable(arguments, 'subscribe', resolve, promise);
  return promise;
};

// resolve is used for SYNC mode.
// In this mode the subscribeSync funcion retuns a promise
// which is gonna be either:
//   - resolved, if we are already subscribed to all data (it's in racer model)
//   - pending, if at least one subscription needs to be executed
racer.Model.prototype._forSubscribable = function(argumentsObject, method, resolve, promise) {
  var args, cb;
  if (!argumentsObject.length) {
    // Use this model's scope if no arguments
    args = [null];
  } else if (typeof argumentsObject[0] === 'function') {
    // Use this model's scope if the first argument is a callback
    args = [null];
    cb = argumentsObject[0];
  } else if (Array.isArray(argumentsObject[0])) {
    // Items can be passed in as an array
    args = argumentsObject[0];
    cb = argumentsObject[1];
  } else {
    // Or as multiple arguments
    args = Array.prototype.slice.call(argumentsObject);
    var last = args[args.length - 1];
    if (typeof last === 'function') cb = args.pop();
  }

  // [SYNC MODE] For sync usage of subscribe
  if (resolve) cb = function () {
    promise.sync = true;
    resolve();
  };

  var group = RacerUtil.asyncGroup(this.wrapCallback(cb));
  var finished = group();
  var docMethod = method + 'Doc';

  this.root.connection.startBulk();
  for (var i = 0; i < args.length; i++) {
    var item = args[i];
    if (item instanceof RacerQuery) {
      item[method](group());
    } else {
      var segments = this._dereference(this._splitPath(item));
      if (segments.length === 2) {
        // Do the appropriate method for a single document.
        this[docMethod](segments[0], segments[1], group());
      } else {
        var message = 'Cannot ' + method + ' to path: ' + segments.join('.');
        group()(new Error(message));
      }
    }
  }
  this.root.connection.endBulk();

  // [SYNC MODE] Don't force async execution if we are in sync mode
  if (resolve) return finished();

  process.nextTick(finished);
};

// Monkey patch query subscribe to return data synchronously if it's in cache
RacerQuery.prototype.subscribe = function(cb) {
  cb = this.model.wrapCallback(cb);
  this.model._context.subscribeQuery(this);

  if (this.subscribeCount++) {
    var query = this;
    // Synchronously return data if it's already in cache
    // process.nextTick(function() {
    var data = query.model._get(query.segments);
    if (data) {
      cb();
    } else {
      query._pendingSubscribeCallbacks.push(cb);
    }
    // });
    return this;
  }

  if (!this.created) this.create();

  var options = (this.options) ? RacerUtil.copy(this.options) : {};
  options.results = this._getShareResults();

  // When doing server-side rendering, we actually do a fetch the first time
  // that subscribe is called, but keep track of the state as if subscribe
  // were called for proper initialization in the client
  if (this.model.root.fetchOnly) {
    this._shareFetchedSubscribe(options, cb);
  } else {
    this._shareSubscribe(options, cb);
  }

  return this;
};
