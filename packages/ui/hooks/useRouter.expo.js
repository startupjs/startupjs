import { useMemo, useContext } from 'react'
import RouterContext from '@startupjs/utils/RouterContext'
import { router, usePathname as _usePathname } from 'expo-router'

// For now we force to always use the parent router (expo) if it's available.
// And expo-router handles the browser history for us.
// It's important to use just one router in the app for navigation to avoid conflicts.
// In future we might change this behavior but atm the simplest solution is
// to only use the parent router for navigation.
const DEFAULT_USE_PARENT = true

// TODO: support having only startupjs router in the expo project

export default function useRouter () {
  const startupjsRouter = useContext(RouterContext)
  const basename = (!DEFAULT_USE_PARENT && startupjsRouter?.basename) || '/'
  const pathname = _usePathname()
  const contextAwareRouter = useMemo(() => {
    return {
      basename,
      replace (url, ...args) {
        if (!escapeToParent(basename, url) && startupjsRouter) startupjsRouter.replace(url, ...args)
        else router.replace(normalizeUrl(url, pathname), ...args)
      },
      push (url, ...args) {
        if (!escapeToParent(basename, url) && startupjsRouter) startupjsRouter.push(url, ...args)
        else router.push(normalizeUrl(url, pathname), ...args)
      },
      back () {
        if (!DEFAULT_USE_PARENT && startupjsRouter) startupjsRouter.back()
        else router.back()
      },
      // on expo-router `navigate` automatically decides to use push or replace
      navigate (url, ...args) {
        if (!escapeToParent(basename, url) && startupjsRouter) startupjsRouter.navigate(url, ...args)
        else router.navigate(normalizeUrl(url, pathname), ...args)
      },
      canGoBack () {
        if (!DEFAULT_USE_PARENT && startupjsRouter) return startupjsRouter.canGoBack()
        else return true
      },
      setParams (...args) {
        if (!DEFAULT_USE_PARENT && startupjsRouter) startupjsRouter.setParams(...args)
        else router.setParams(...args)
      },
      usePathname () {
        if (!DEFAULT_USE_PARENT && startupjsRouter) {
          const { pathname } = startupjsRouter.usePathname()
          return basename.replace(/\/$/, '') + pathname
        } else return _usePathname()
      }
    }
  }, [basename, startupjsRouter])

  return contextAwareRouter
}

// allow escaping into the parent router if the absolute url isn't in the
// current router's basename
function escapeToParent (basename, url, { force = DEFAULT_USE_PARENT } = {}) {
  if (force) return true
  if (!/^\//.test(url)) return // allow escaping only for absolute urls
  if (url.startsWith(basename)) return
  return true
}

const EXTERNAL_LINK_REGEXP = /^(https?:\/\/|\/\/)/i
function normalizeUrl (href, pathname) {
  if (!EXTERNAL_LINK_REGEXP.test(href) && !/^[/?#]/.test(href)) {
    let p = pathname
    p = p.replace(/#.*$/, '') // remove trailing hash
    p = p.replace(/\?.*$/, '') // remove trailing query
    p = p.replace(/\/$/, '') // remove trailing slash
    href = href.replace(/^\//, '') // remove leading slash
    href = href.replace(/\/$/, '') // remove trailing slash
    href = p + '/' + href
  }
  return href
}
