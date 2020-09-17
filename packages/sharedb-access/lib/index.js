import isFunction from 'lodash/isFunction.js'
import cloneDeep from 'lodash/cloneDeep.js'
import * as util from './util.js'
import Debug from 'debug'

const debug = Debug('access')

// there are local extensions of error codes for error classification
// code 403.1: Permission denied (create)
// code 403.2: Permission denied (read)
// code 403.3: Permission denied (update)
// code 403.4: Permission denied (delete)

const operations = [
  'Read',
  'Create',
  'Delete',
  'Update'
]

function getOrigin(agent) {
  return (agent.stream.isServer) ? 'server' : 'browser'
}

// Possible options:
// dontUseOldDocs: false - if true don't save unupdated docs for update action
// opCreatorUserIdPath - path to 'userId' for op's meta

export default class ShareDBAccess {
  constructor(backend, options) {
   if (!(this instanceof ShareDBAccess)) return new ShareDBAccess(backend, options)

    this.options = options || {}
    this.allow = {}
    this.deny = {}

    backend.use('readSnapshots', this.readSnapshotsHandler.bind(this))
    backend.use('apply', this.applyHandler.bind(this))
    backend.use('commit', this.commitHandler.bind(this))

    this.initBackend(backend)
  }

  initBackend(backend) {
    const allow = this.allow
    const deny = this.deny

    function registerAllowHandler(op){
      if (backend['allow' + op]) return

      backend['allow' + op] = function (collection, fn) {
        if(collection.indexOf('*') > -1) {
          allow[op]['**'] = allow[op]['**'] || []
          allow[op]['**'].push({fn: fn, pattern: collection})
        } else {
          allow[op][collection] = allow[op][collection] || []
          allow[op][collection].push(fn)
        }
      }
    }

    function registerDenyHandler(op){
      if (backend['deny' + op]) return

      backend['deny' + op] = function (collection, fn) {
        if(collection.indexOf('*') > -1) {
          deny[op]['**'] = deny[op]['**'] || []
          deny[op]['**'].push({fn: fn, pattern: collection})
        } else {
          deny[op][collection] = deny[op][collection] || []
          deny[op][collection].push(fn)
        }
      }
    }

    // Export functions
    operations.forEach(function(op){
      allow[op] = allow[op] || {}
      deny[op] = deny[op] || {}
      registerAllowHandler(op)
      registerDenyHandler(op)
    })
  }

  // ++++++++++++++++++++++++++++++++ UPDATE ++++++++++++++++++++++++++++++++++
  commitHandler (shareRequest, done){
    this.commitHandlerAsync(shareRequest)
      .then((res) => done(res))
      .catch((err) => done(err))
  }

  async commitHandlerAsync (shareRequest) {
    // Only derby-app client-request and server
    // if we set up checkServerAccess flag in stream
    //
    // we can set it up in the express middleware
    // before derby-apps routing in express
    // and set it off after
    const stream = shareRequest.agent.stream || {}
    if (stream.isServer && !stream.checkServerAccess) return

    const opData = shareRequest.op
    if (opData.create || opData.del) return

    const session = shareRequest.agent.connectSession || {}

    const collection = shareRequest.index || shareRequest.collection
    const docId = shareRequest.id

    const oldDoc = (shareRequest.originalSnapshot && shareRequest.originalSnapshot.data) || {}
    const newDoc = shareRequest.snapshot.data

    const ops = opData.op

    const ok = await this.check('Update', collection, [docId, oldDoc, newDoc, ops, session, shareRequest])
    debug('update', ok, collection, docId, oldDoc, newDoc, ops, session)

    if (ok) return

    return { message: '403: Permission denied (update), collection: ' + collection + ', docId: '+ docId, code: 403.3 }
  }

  applyHandler (shareRequest, done) {
    this.applyHandlerAsync(shareRequest)
      .then((res) => done(res))
      .catch((err) => done(err))
  }

  async applyHandlerAsync (shareRequest) {
    const opData = shareRequest.op
    const session = shareRequest.agent.connectSession || {}
    const opUId = session[this.options.opCreatorUserIdPath || 'userId']
    const stream = shareRequest.agent.stream || {}

    // Save userId for audit purpose
    opData.m = opData.m || {}
    if (opUId) opData.m.uId = opUId

    if (stream.isServer && !stream.checkServerAccess) return

    const collection = shareRequest.index || shareRequest.collection
    const docId = shareRequest.id
    const snapshot = shareRequest.snapshot

    // ++++++++++++++++++++++++++++++++ CREATE ++++++++++++++++++++++++++++++++++
    if (opData.create){

      const doc = opData.create.data

      const ok = await this.check('Create', collection, [docId, doc, session, shareRequest])
      debug('create', ok, collection, docId, doc)

      if (ok) return

      return { message: '403: Permission denied (create), collection: ' + collection + ', docId: '+ docId, code: 403.1 }
    }

    // ++++++++++++++++++++++++++++++++ DELETE ++++++++++++++++++++++++++++++++++
    if (opData.del) {
      const doc = snapshot.data

      const ok = await this.check('Delete', collection, [docId, doc, session, shareRequest])
      debug('delete', ok, collection, docId, doc)
      if (ok) return

      return { message: '403: Permission denied (delete), collection: ' + collection + ', docId: '+ docId, code: 403.4 }
    }

    // For Update
    if (!this.options.dontUseOldDocs) {
      shareRequest.originalSnapshot = cloneDeep(snapshot)
    }

    return
  }

  readSnapshotsHandler (shareRequest, done){
    Promise.all(shareRequest.snapshots.map(snapshot => {
      return this.docHandlerAsync({
        index: shareRequest.index,
        collection: shareRequest.collection,
        id: snapshot.id,
        snapshot: snapshot,
        agent: shareRequest.agent
      })
    }))
    .then(reasons => {
      done(reasons.find(reason => reason))
    })
    .catch(err => done(err))
  }

  async docHandlerAsync (shareRequest){
    // ++++++++++++++++++++++++++++++++ READ ++++++++++++++++++++++++++++++++++

    const stream = shareRequest.agent.stream || {}
  
    if (stream.isServer && !stream.checkServerAccess) return

    const collection = shareRequest.index || shareRequest.collection
    const docId = shareRequest.id
    const doc = (shareRequest.snapshot && shareRequest.snapshot.data) || {}
    const agent = shareRequest.agent

    const session = agent.connectSession || {}

    const ok = await this.check('Read', collection, [docId, doc, session, shareRequest])

    debug('read', ok, collection, [docId, doc, session])

    if (ok) return

    return { message: '403: Permission denied (read), collection: ' + collection + ', docId: '+ docId, code: 403.2 }
  }

  async check (operation, collection, args){
    const allow = this.allow
    const deny = this.deny

    // First, check pattern matching collections
    allow[operation]['**'] = allow[operation]['**'] || []
    deny[operation]['**'] = deny[operation]['**'] || []

    const allowPatterns = allow[operation]['**']
    const denyPatterns = deny[operation]['**']

    allow[operation][collection] = allow[operation][collection] || []
    deny[operation][collection] = deny[operation][collection] || []

    const allowValidators = allow[operation][collection]
    const denyValidators = deny[operation][collection]

    let isAllowed = false

    for(let i = 0, len = allowPatterns.length; i < len; i++) {
      const pattern = allowPatterns[i].pattern

      const regExp = util.patternToRegExp(pattern)

      if(regExp.test(collection)) isAllowed = await apply(allowPatterns[i])
      
      if (isAllowed) break
    }

    for (let i = 0; !isAllowed && i < allowValidators.length; i++) {
      isAllowed = await apply(allowValidators[i])
      if (isAllowed) break
    }

    let isDenied = false

    for(let i = 0, len = denyPatterns.length; i < len; i++) {
      const pattern = denyPatterns[i].pattern

      const regExp = util.patternToRegExp(pattern)

      if(regExp.test(collection)) isDenied = await apply(denyPatterns[i])

      if (isDenied) break
    }

    for (let j = 0; !isDenied && j < denyValidators.length; j++) {
      isDenied = await apply(denyValidators[j])
      if (isDenied) break
    }

    return isAllowed && !isDenied

    async function apply(validator) {
      if (isFunction(validator)) return await validator.apply(this, args)
      return await validator.fn.apply(this, args)
    }
  }
}