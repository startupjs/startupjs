import { observe, unobserve } from '@nx-js/observer-util'
import { SEGMENTS } from './Signal.js'
import { set as _set, del as _del } from './dataTree.js'
import { LOCAL } from './Value.js'

// this is `let` to be able to directly change it if needed in tests or in the app
export let DELETION_DELAY = 0 // eslint-disable-line prefer-const

class ReactionSubscriptions {
  constructor () {
    this.initialized = new Map()
    this.fr = new FinalizationRegistry(([id, reaction]) => this.destroy(id, reaction))
  }

  init ($value, fn) {
    const id = $value[SEGMENTS][1]
    if (this.initialized.has(id)) return

    this.initialized.set(id, true)
    const reactionScheduler = reaction => runReaction(id, reaction)
    const reaction = observe(fn, { lazy: true, scheduler: reactionScheduler })
    this.fr.register($value, [id, reaction])
    runReaction(id, reaction)
  }

  destroy (id, reaction) {
    this.initialized.delete(id)
    unobserve(reaction)
    // don't delete data right away to prevent dependent reactions which are also going to be GC'ed
    // from triggering unnecessarily
    setTimeout(() => _del([LOCAL, id]), DELETION_DELAY)
  }
}

export const reactionSubscriptions = new ReactionSubscriptions()

function runReaction (id, reaction) {
  const newValue = reaction()
  _set([LOCAL, id], newValue)
}

export function setDeletionDelay (delayInMs) {
  DELETION_DELAY = delayInMs
}
