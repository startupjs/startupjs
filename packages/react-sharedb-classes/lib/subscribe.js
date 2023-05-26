import isArray from 'lodash/isArray.js'
import uniq from 'lodash/uniq.js'
import union from 'lodash/union.js'
import _keys from 'lodash/keys.js'
import isEqual from 'lodash/isEqual.js'
import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import model from '@startupjs/model'
import Doc from './types/Doc.js'
import Query from './types/Query.js'
import QueryExtra from './types/QueryExtra.js'
import Local from './types/Local.js'
import Value from './types/Value.js'
import Api from './types/Api.js'
import co from 'co'
import {
  _semaphore as semaphore,
  batching,
  _isExtraQuery as isExtraQuery
} from '@startupjs/react-sharedb-util'
import {
  observe,
  unobserve,
  observable
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
    const AutorunComponent = Component.__isSubscription
      ? Component
      : getAutorunComponent(Component, isStateless)
    const SubscriptionsContainer = getSubscriptionsContainer(
      AutorunComponent,
      fn ? [fn] : []
    )
    return hoistStatics(SubscriptionsContainer, AutorunComponent)
  }
}

function getAutorunComponent (Component, isStateless) {
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

      const updateFn = () => {
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

function getSubscriptionsContainer (DecoratedComponent, fns) {
  class SubscriptionsContainer extends React.Component {
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount () {
      this.model = this.getOrCreateModel()
      this.models = {}
      // pipe the local model into props as $STORE
      this.models[$STORE] = this.model
      this.models[$STORE_DEPRECATED] = this.model // TODO: DEPRECATED
      this[STORE] = this.model.get()
      co(this.autorunSubscriptions.bind(this))
    }

    // TODO: Implement queueing
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps (nextProps) {
      const that = this
      co(function * () {
        for (const dataFn of that.dataFns) {
          yield dataFn(nextProps)
          if (that.unmounted) return
          if (that.doForceUpdate) {
            that.doForceUpdate = false
            that.setState(DUMMY_STATE)
          }
        }
      })
    }

    // TODO: Maybe throw an error when passing used $STORE to new @subscribe
    getOrCreateModel () {
      if (this.props[$STORE] && !this.props[$STORE].__used) {
        return this.props[$STORE]
      } else {
        const model = generateScopedModel()
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
        const computationName = getComputationName(index)
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
      for (const itemId in this.items) {
        this.destroyItem(itemId, true, true)
      }

      for (const modelId in this.models) {
        delete this.models[modelId]
      }
      delete this.models
      delete this[STORE]
      delete this.model // delete the actual model
    }

    render () {
      this.rendered = true
      if (this.loaded) {
        return React.createElement(DecoratedComponent, Object.assign({},
          this.props,
          {
            [STORE]: this[STORE],
            [STORE_DEPRECATED]: this[STORE] // TODO: DEPRECATED
          },
          this.models,
          {
            ref: (...args) => {
              if (!DecoratedComponent.__isSubscription) {
                if (this.props.innerRef) this.props.innerRef(...args)
              }
            }
          }))
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
    * autorunSubscriptions () {
      this.items = {}
      this.comps = {}
      this.dataFns = []
      const that = this
      for (let index = 0; index < fns.length; index++) {
        const fn = fns[index]
        let subscriptions = {}
        const dataFn = co.wrap(function * (props) {
          // When there are multiple @subscribe's, the outermost
          // is going to destroy the model.
          // This check makes sure that inner @subscribe's don't
          // fire in that case.
          if (!that.model.get()) return

          const prevSubscriptions = subscriptions || {}
          const computationName = getComputationName(index)
          const subscribeFn = () => {
            subscriptions = fn.call(
              that,
              typeof props === 'function' ? that.props : props
            )
          }

          that.comps[computationName] && unobserve(that.comps[computationName])
          that.comps[computationName] = observe(subscribeFn, {
            scheduler: dataFn
          })

          const keys = uniq(union(_keys(prevSubscriptions), _keys(subscriptions)))
          const promises = []
          batching.batch(function () {
            for (const key of keys) {
              if (!isEqual(subscriptions[key], prevSubscriptions[key])) {
                if (subscriptions[key]) {
                  promises.push(that.initItem(key, subscriptions[key]))
                } else {
                  that.destroyItem(key, true)
                }
              }
            }
          })
          yield promises
        })
        this.dataFns.push(dataFn)
        yield dataFn(this.props)
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
      const explicitType = params && params.__subscriptionType
      if (explicitType) {
        subscriptionParams = params.params
        constructor = getItemConstructor(explicitType)
      } else {
        subscriptionParams = params
        constructor = getItemConstructorFromParams(params)
      }
      const item = new constructor(this.model, key, subscriptionParams)
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
          const keyModelName = getScopedModelName(key)
          if (!this.models[keyModelName]) {
            this.models[keyModelName] = this.model.at(key)
            this.doForceUpdate = true
          }
        })
      }
      if (item.init) {
        const initRes = item.init()

        if (!initRes) {
          finishInit()
          return Promise.resolve()
        }
        return initRes.then(finishInit)
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
        const keyModelName = getScopedModelName(key)
        if (terminate) {
          delete this[keyModelName]
          this.doForceUpdate = true
        }
        this.items[key].destroy()
      })
      delete this.items[key]
    }
  }
  SubscriptionsContainer.__isSubscription = true
  return SubscriptionsContainer
}

function generateScopedModel () {
  const path = `${DEFAULT_COLLECTION}.${model.id()}`
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
    const [, queryOrId] = params
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
  for (const method of methodsToBind) {
    object[method] = object[method].bind(object)
  }
}

function getScopedModelName (key) {
  return `$${key}`
}
