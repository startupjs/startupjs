import { getRedis, getRedisOptions } from 'startupjs/server'
import { normalizeTrackingKey } from './jobOptions.js'
import { normalizeJobRef, serializeJobRef } from './jobRef.js'
import { getRuntimeOptions } from './runtime.js'

const TRACKING_META_TTL_SECONDS = 7 * 24 * 60 * 60

let redis

export async function trackJob ({ ref, name, trackingKey }) {
  const normalizedTrackingKey = normalizeTrackingKey(trackingKey)
  if (!normalizedTrackingKey) return

  const normalizedRef = normalizeJobRef(ref, 'trackJob')
  const member = serializeJobRef(normalizedRef)
  const client = getTrackingRedis()
  const setKey = getTrackingSetKey(normalizedTrackingKey)
  const metaKey = getTrackingMetaKey(normalizedRef)

  await client
    .multi()
    .sadd(setKey, member)
    .expire(setKey, TRACKING_META_TTL_SECONDS)
    .hset(metaKey, {
      id: normalizedRef.id,
      worker: normalizedRef.worker,
      name: name || '',
      trackingKey: normalizedTrackingKey,
      createdAt: String(Date.now())
    })
    .expire(metaKey, TRACKING_META_TTL_SECONDS)
    .exec()
}

export async function getTrackedJobRefs (trackingKey) {
  const normalizedTrackingKey = normalizeTrackingKey(trackingKey)
  if (!normalizedTrackingKey) return []

  const members = await getTrackingRedis().smembers(getTrackingSetKey(normalizedTrackingKey))
  return members.map(member => normalizeJobRef(member, 'getTrackedJobRefs'))
}

export async function untrackJobRef (jobRef, trackingKey) {
  const ref = normalizeJobRef(jobRef, 'untrackJobRef')
  const client = getTrackingRedis()
  const member = serializeJobRef(ref)
  const metaKey = getTrackingMetaKey(ref)

  if (!trackingKey) {
    const meta = await client.hgetall(metaKey)
    trackingKey = meta?.trackingKey
  }

  const normalizedTrackingKey = normalizeTrackingKey(trackingKey)
  const commands = client.multi().del(metaKey)

  if (normalizedTrackingKey) {
    commands.srem(getTrackingSetKey(normalizedTrackingKey), member)
  }

  await commands.exec()
}

export async function closeTrackingRedis () {
  if (!redis) return

  const client = redis
  redis = undefined
  await client.quit().catch(() => {
    client.disconnect()
  })
}

function getTrackingRedis () {
  if (!redis) {
    redis = getRedis({
      ...getRedisOptions({ addPrefix: false })
    })
  }
  return redis
}

function getTrackingSetKey (trackingKey) {
  return `${getRuntimeOptions().queuePrefix}:worker:tracking:${trackingKey}`
}

function getTrackingMetaKey (ref) {
  return `${getRuntimeOptions().queuePrefix}:worker:tracking-meta:${ref.worker}:${ref.id}`
}
