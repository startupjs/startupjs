/**
 * COMPAT-ONLY legacy entrypoint for old LMS code which still imports helpers from
 * `startupjs/app`.
 *
 * Purpose:
 * - preserve the old import surface while the app is being migrated to the newer
 *   router/runtime APIs
 * - reduce mechanical diffs against older codebases which historically depended on
 *   `startupjs/app`
 *
 * Contract in this compat file:
 * - `pathFor(name, params)` delegates to an application-registered implementation
 * - `useHistory()` exposes the old imperative navigation shape on top of an
 *   application-registered `useRouter` implementation
 *
 * Explicit limitations:
 * - this file is internal compat support and is intentionally not part of the
 *   main documented Startupjs API surface
 * - it does NOT try to reintroduce the full historic `startupjs/app` package
 * - only the exports needed by the LMS migration are provided here
 * - `pathFor` must be initialized by the host app via `__setCompatPathFor()`
 * - `useHistory` must be initialized by the host app via `__setCompatUseRouter()`
 * - server-side `@startupjs/app/server` and the old default `App` export are out of
 *   scope for this package and must be handled separately if needed
 */

let compatPathFor
let compatUseRouter

export function __setCompatPathFor (fn) {
  if (typeof fn !== 'function') {
    throw new Error('[startupjs/app] __setCompatPathFor expects a function')
  }
  compatPathFor = fn
}

export function __setCompatUseRouter (fn) {
  if (typeof fn !== 'function') {
    throw new Error('[startupjs/app] __setCompatUseRouter expects a function')
  }
  compatUseRouter = fn
}

export function __resetCompatPathForForTests () {
  compatPathFor = undefined
  compatUseRouter = undefined
}

export function pathFor (...args) {
  if (typeof compatPathFor !== 'function') {
    throw new Error(
      '[startupjs/app] pathFor is not initialized. ' +
      'The host app must register a compat implementation via __setCompatPathFor().'
    )
  }
  return compatPathFor(...args)
}

export function useHistory () {
  if (typeof compatUseRouter !== 'function') {
    throw new Error(
      '[startupjs/app] useHistory is not initialized. ' +
      'The host app must register a compat useRouter implementation via __setCompatUseRouter().'
    )
  }
  const router = compatUseRouter()
  return {
    push: (url, ...args) => router.navigate(url, ...args),
    replace: (url, ...args) => router.replace(url, ...args),
    goBack: (...args) => {
      if (typeof router.back === 'function') return router.back(...args)
      return router.navigate('..')
    }
  }
}
