import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const ROUTE_FILE_EXTENSION_REGEX = /\.[cm]?[jt]sx?$/
const DECLARATION_FILE_REGEX = /\.d\.[cm]?ts$/

export default function createFilesystemRouteMatcher ({
  directory,
  basePath = '',
  getRouteName
}) {
  if (!existsSync(directory)) return () => false

  const routeRegexps = []
  const baseSegments = splitPath(basePath)

  walk(directory, [])

  return function matchesFilesystemRoute (req) {
    const { pathname } = new URL(req.originalUrl || req.url, 'http://localhost')
    return routeRegexps.some(regexp => regexp.test(pathname))
  }

  function walk (folder, segments) {
    for (const entry of readdirSync(folder)) {
      const entryPath = join(folder, entry)
      const stat = statSync(entryPath)

      if (stat.isDirectory()) {
        walk(entryPath, [...segments, entry])
        continue
      }

      const routeName = getRouteName(entry)
      if (!routeName) continue
      routeRegexps.push(createRouteRegexp([...baseSegments, ...segments, routeName]))
    }
  }
}

export function getStandardRouteName (filename) {
  if (
    filename.startsWith('_') ||
    DECLARATION_FILE_REGEX.test(filename) ||
    !ROUTE_FILE_EXTENSION_REGEX.test(filename)
  ) {
    return
  }

  return filename.replace(ROUTE_FILE_EXTENSION_REGEX, '')
}

export function getExpoApiRouteName (filename) {
  if (
    filename.startsWith('_') ||
    DECLARATION_FILE_REGEX.test(filename) ||
    !ROUTE_FILE_EXTENSION_REGEX.test(filename)
  ) {
    return
  }

  const routeName = filename.replace(ROUTE_FILE_EXTENSION_REGEX, '')
  if (!routeName.endsWith('+api')) return
  return routeName.slice(0, -4) || 'index'
}

function createRouteRegexp (segments) {
  const source = segments
    .map(toRouteRegexpSource)
    .filter(Boolean)
    .join('')

  if (!source) return /^\/?$/
  return new RegExp(`^${source}\\/?$`)
}

function toRouteRegexpSource (segment) {
  if (!segment || segment === 'index' || /^\(.+\)$/.test(segment)) return ''
  if (/^\[\[\.\.\..+\]\]$/.test(segment)) return '(?:\\/.*)?'
  if (/^\[\.\.\..+\]$/.test(segment)) return '\\/.+'
  if (/^\[.+\]$/.test(segment) || /^:.+/.test(segment)) return '\\/[^/]+'
  return '\\/' + escapeRegExp(segment)
}

function splitPath (path) {
  return path.split('/').filter(Boolean)
}

function escapeRegExp (value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
