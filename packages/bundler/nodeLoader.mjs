import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import callLoader from './lib/callLoader.js'
import yamlLoader from './lib/yamlLoader.js'
import eliminatorLoader from './lib/eliminatorLoader.js'

export function resolve (specifier, context, nextResolve) {
  const { parentURL = null } = context

  // Handling YAML files
  if (specifier.endsWith('.yaml')) {
    return {
      shortCircuit: true,
      url: new URL(specifier, parentURL).href
    }
  }

  // Let Node.js handle all other specifiers.
  return nextResolve(specifier, context, nextResolve)
}

export async function load (url, context, nextLoad) {
  // If it's a YAML file, read it, parse it and return it as JavaScript source code
  if (/\.yaml$/.test(url)) {
    const filePath = fileURLToPath(url)
    let source = await readFile(filePath, 'utf8')
    source = callLoader(yamlLoader, source, filePath)
    return {
      format: 'module',
      shortCircuit: true,
      source
    }
  }

  // process code elimination of other envs for *.plugin.js and startupjs.config.js
  if (/(?:[./]plugin\.[mc]?[jt]sx?|startupjs\.config\.js)$/.test(url)) {
    const filePath = fileURLToPath(url)
    let source = await readFile(filePath, 'utf8')
    source = callLoader(eliminatorLoader, source, filePath, { envs: ['server', 'isomorphic'] })
    return {
      format: 'module',
      shortCircuit: true,
      source
    }
  }

  // Let Node.js handle all other URLs.
  return nextLoad(url, context, nextLoad)
}
