// in expo projects we need to get parent's router path (which is expo-router)
import { useSegments, usePathname } from 'expo-router'

const IS_PARAM = /^\[/
const IS_SPREAD_PARAM = /^\[\.\.\./

// if all segments are static, use them to build the pathname.
// This is beneficial since it will prevent extra re-renders.
// Otherwise we just use pathname from expo itself as the basename
// which will lead to rerenders whenever parent path changes
// but there is no way around it.
export default function useParentPath () {
  let segments = useSegments()
  let pathname = usePathname()
  if (IS_SPREAD_PARAM.test(segments[segments.length - 1])) {
    segments = segments.slice(0, -1)
  }
  if (!segments.some(segment => IS_PARAM.test(segment))) {
    pathname = '/' + segments.join('/')
  }
  pathname = pathname.replace(/#.*$/, '') // remove trailing hash
  pathname = pathname.replace(/\?.*$/, '') // remove trailing query
  pathname = pathname.replace(/\/$/, '') // remove trailing slash
  return pathname
}
