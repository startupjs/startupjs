import { useRef, useState, useEffect } from "react"
import useRouter from '@startupjs/utils/useRouter'

export default function useTransformRoutes (routes) {
  const cacheRef = useRef(new WeakMap())
  const routesRef = useRef(routes)
  const { transformedRoutes, isChanged } = transformRoutes(routes, cacheRef.current)
  if (isChanged) routesRef.current = transformedRoutes
  return routesRef.current
}

function transformRoutes (routes, cache) {
  let isChanged = false
  const transform = (route) => {
    if (cache.has(route)) return cache.get(route)

    let newRoute = { ...route }

    if (route.filters?.length) {
      isChanged = true

      delete newRoute.filters

      newRoute = {
        ...newRoute,
        element: (
          <CheckFilters filters={route.filters}>
            {route.element}
          </CheckFilters>
        ),
      }
    }

    if (route.children) {
      newRoute.children = route.children.map(transform)
    }

    cache.set(route, newRoute)
    return newRoute
  }

  const transformedRoutes = routes.map(transform)
  return { transformedRoutes, isChanged }
}

const CheckFilters = ({ filters = [], children }) => {
  const [isReady, setIsReady] = useState()
  const router = useRouter()

  useEffect(() => {
    const executeFilters = (index = 0) => {
      if (index >= filters.length) {
        setIsReady(true)
        return
      }

      const next = () => executeFilters(index + 1)
      const redirect = (path = '/') => {
        setTimeout(() => router.replace(path), 0)
      }

      filters[index](next, redirect)
    }

    executeFilters()
  }, [filters])

  if (!isReady) return null
  return children
}
