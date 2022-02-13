export const DEBUG = {}

if (typeof window !== 'undefined') {
  if (!window.__startupjs__) window.__startupjs__ = {}
  window.__startupjs__.DEBUG = DEBUG
}

export function __increment (name) {
  if (!DEBUG[name]) DEBUG[name] = 0
  DEBUG[name] += 1
}

export function __decrement (name) {
  if (!DEBUG[name]) DEBUG[name] = 0
  DEBUG[name] -= 1
}
