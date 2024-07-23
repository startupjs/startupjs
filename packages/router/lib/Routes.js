import { memo, useMemo, createElement as el, useRef, useState, useEffect, useContext } from 'react'
import { Platform } from 'react-native'
import {
  useRoutes,
  useNavigate,
  MemoryRouter,
  useResolvedPath,
  resolvePath,
  useLocation
} from 'react-router'
import RouterContext from '@startupjs/utils/RouterContext'
import useParentBasename from './useParentBasename'
import useParentPathname from './useParentPathname'
import useTransformRoutes from './useTransformRoutes.js'
import SlotsHost from './SlotsHost.js'

const IS_WEB = Platform.OS === 'web'

export default memo(function Routes ({ basename, routes }) {
  if (!Array.isArray(routes)) throw Error(ERRORS.notArray)
  const parentBasename = useParentBasename()
  const parentPathname = useParentPathname()
  basename = basename || parentBasename
  const initialEntries = useMemo(() => [parentPathname || basename], [parentPathname || basename])
  return (
    el(MemoryRouter, { basename, initialEntries },
      el(UseRouterProvider, { basename },
        el(SlotsHost, null,
          el(RoutesSelector, { routes })
        )
      )
    )
  )
})

const RoutesSelector = memo(function RoutesSelector ({ routes }) {
  routes = useTransformRoutes(routes)
  const element = useRoutes(routes)
  return element
})

// This is only being used in pure react-native projects
// since in @startupjs/ui/useRouter.expo.js
// we force to always use the parent router (expo) if it's available.
// And expo-router handles the browser history for us.
// It's important to use just one router in the app for navigation to avoid conflicts.
const UseRouterProvider = memo(function UseRouterProvider ({ basename, children }) {
  const navigate = useNavigate()
  let { pathname } = useLocation()
  pathname = basename.replace(/\/$/, '') + '/' + pathname
  const router = useMemo(() => ({
    basename,
    replace (url) { navigate(url, { replace: true }); HISTORY.replace(normalizeUrl(url, pathname)) },
    push (url) { navigate(url); HISTORY.push(normalizeUrl(url, pathname)) },
    back () { navigate(-1); HISTORY.back() },
    // on expo-router `navigate` automatically decides to use push or replace
    navigate (url) { navigate(url); HISTORY.navigate(normalizeUrl(url, pathname)) },
    canGoBack () { return true }, // TODO: implement checking
    setParams () { throw Error('Not implemented for @startupjs/router') },
    usePathname () { return useResolvedPath() }
  }), [basename, navigate, pathname])
  return el(RouterContext.Provider, { value: router }, children)
})

function normalizeUrl (url, pathname) {
  return resolvePath(url, pathname).pathname + resolvePath(url, pathname).search + resolvePath(url, pathname).hash
}

const HISTORY = {
  push (url) { if (IS_WEB) window.history.pushState(null, null, url) },
  replace (url) { if (IS_WEB) window.history.replaceState(null, null, url) },
  back () { if (IS_WEB) window.history.back() },
  navigate (url) { if (IS_WEB) window.history.pushState(null, null, url) }
}

const ERRORS = {
  notArray: '<Routes>: `routes` prop must be an array'
}
