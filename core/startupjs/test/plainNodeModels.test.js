import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const fixtureRoot = fileURLToPath(new URL('./fixtures/plain-node-models/', import.meta.url))

// Plain Node (unit tests, scripts) runs without the StartupJS Babel loader.
// Importing `startupjs` there must not load the project's model files:
// they import `startupjs` back, and Node refuses that require() cycle
// (ERR_REQUIRE_CYCLE_MODULE). Models are wired by the Babel plugin instead.
test('importing startupjs in plain Node does not load project models', () => {
  const result = spawnSync(process.execPath, [
    '--input-type=module',
    '-e',
    "await import('startupjs'); console.log('IMPORTED')"
  ], { cwd: fixtureRoot, encoding: 'utf8' })

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /IMPORTED/)
  assert.doesNotMatch(result.stderr, /ERR_REQUIRE_CYCLE_MODULE/)
})
