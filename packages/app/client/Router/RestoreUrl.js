import React, { useRef, useMemo, useEffect } from 'react'
import { Redirect, useLocation } from 'react-router'
import { pug, $root } from 'startupjs'

export default function RestoreUrl ({ children }) {
  const isMountedRef = useRef(false)
  const location = useLocation()
  const currentUrl = location.pathname

  const restoreUrl = useMemo(() => {
    return $root.get('_session.restoreUrl')
  }, [])

  useEffect(() => {
    if (restoreUrl) $root.del('_session.restoreUrl')
    isMountedRef.current = true
  }, [])

  if (!isMountedRef.current && restoreUrl && currentUrl !== restoreUrl) {
    return pug`
      Redirect(to=restoreUrl)
    `
  }

  return pug`
    = children
  `
}
