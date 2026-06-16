import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createJobRef,
  normalizeJobRef,
  parseJobRef,
  serializeJobRef
} from '../jobRef.js'

test('creates serializable job refs from BullMQ jobs', () => {
  const ref = createJobRef({ id: 123 }, 'default')

  assert.deepEqual(ref, {
    id: '123',
    worker: 'default'
  })
})

test('serializes and parses job refs', () => {
  const ref = {
    id: 'abc',
    worker: 'priority'
  }

  assert.equal(serializeJobRef(ref), 'priority:abc')
  assert.deepEqual(parseJobRef('priority:abc'), ref)
})

test('normalizes object and string job refs', () => {
  assert.deepEqual(normalizeJobRef({ id: 1, worker: 'default' }), {
    id: '1',
    worker: 'default'
  })
  assert.deepEqual(normalizeJobRef('default:1'), {
    id: '1',
    worker: 'default'
  })
})

test('throws on malformed job refs', () => {
  assert.throws(() => normalizeJobRef({ id: 1 }), /worker is required/)
  assert.throws(() => normalizeJobRef('default:'), /id is required/)
  assert.throws(() => normalizeJobRef('bad'), /must look like/)
})
