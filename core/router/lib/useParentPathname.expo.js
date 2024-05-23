import { usePathname as _usePathname } from 'expo-router'

export default function useParentPathname () {
  let pathname = _usePathname()
  if (!pathname) return
  pathname = pathname.replace(/\/$/, '') // remove trailing slash
  return pathname
}
