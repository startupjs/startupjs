// Optimized implementation of running hooks from plugins.
// Does not allocate any memory on each call to the hook chain.
// Supports the following features:
// - run this.next() to continue to the next hook
// - if you want to modify the arguments for the next hook, run this.next(...args)
// - if you want to stop the chain, just return a value from the hook
import plugins from './plugins/index.js'

// precompile hooks chains for all hooks
const hookChains = compileHookChains()

// TODO: runHookPrecompiled has a race condition when the same hook is called (for 'create' chain)
//       and the optimizations break stuff because of that. For now use a less optimized version.
export function runHookPrecompiled (hookName, ...args) {
  return hookChains[hookName](...args)
}

function compileHookChains () {
  // find all unique hooks from all plugins
  const hookNames = new Set()
  for (const plugin of plugins) {
    for (const hookName in plugin) {
      hookNames.add(hookName)
    }
  }
  const hooksChains = {}
  for (const hookName of hookNames) hooksChains[hookName] = compileHookChain(hookName)
  return hooksChains
}

function compileHookChain (hookName) {
  const hookFns = plugins
    .map(plugin => plugin[hookName])
    .filter(Boolean)

  const contexts = hookFns.map(() => ({ invokeNext: false, prevArgs: undefined, nextResult: undefined }))
  let isExecuting = false

  let lastFn = () => {}

  for (let i = hookFns.length - 1; i >= 0; i--) {
    const hookFn = hookFns[i]
    const context = contexts[i]
    const currentNext = lastFn

    context.next = (...nextArgs) => {
      context.invokeNext = true
      // If arguments are passed to next, use them. Otherwise, fall back to the previous arguments.
      context.nextResult = currentNext(...(nextArgs.length ? nextArgs : context.prevArgs))
    }

    const isOutermost = i === 0

    lastFn = (...hookArgs) => {
      if (isOutermost) {
        if (isExecuting) throw Error('Hook chain is already executing')
        isExecuting = true
      }

      try {
        context.invokeNext = false
        context.prevArgs = hookArgs // Store the current arguments as previous arguments for the next function
        const result = Reflect.apply(hookFn, context, hookArgs)
        context.prevArgs = undefined // Clear out prevArgs to prevent potential memory leak

        // If `this.next()` was called, then `invokeNext` will be true.
        // In this case, return the result of the subsequent function (`currentNext`) invocation.
        if (context.invokeNext) {
          const nextResult = context.nextResult
          context.nextResult = undefined // Clear out the result to prevent potential memory leak
          return nextResult
        }

        return result
      } finally {
        if (isOutermost) isExecuting = false
      }
    }
  }

  return lastFn
}

export default function runHook (hookName, ...args) {
  const hookFns = plugins
    .map(plugin => plugin[hookName])
    .filter(Boolean)

  let result
  let i = 0

  while (i < hookFns.length) {
    const currentFn = hookFns[i]

    const context = {
      invokeNext: false,
      next: function (...nextArgs) {
        this.invokeNext = true
        // If arguments are passed to next, use them. Otherwise, fall back to the original arguments.
        args = nextArgs.length ? nextArgs : args
      }
    }

    result = currentFn.apply(context, args)
    if (!context.invokeNext) {
      return result
    }

    i++
  }

  return result
}
