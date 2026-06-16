import { getRuntimeOptions } from './runtime.js'
import { serializeJobRef } from './jobRef.js'

const PENDING_THROTTLE_JOB = 'pending'

export async function resolveThrottleTrailing ({ client, deduplication }) {
  const lockKey = getThrottleLockKey(deduplication)
  const ttl = Math.max(0, Number(deduplication.ttl || 0))

  const acquired = await client.set(lockKey, PENDING_THROTTLE_JOB, 'PX', ttl, 'NX')
  if (acquired === 'OK') {
    return {
      action: 'leading',
      lockKey
    }
  }

  let remainingTtl = await client.pttl(lockKey)

  if (remainingTtl < 0) {
    const retryAcquired = await client.set(lockKey, PENDING_THROTTLE_JOB, 'PX', ttl, 'NX')
    if (retryAcquired === 'OK') {
      return {
        action: 'leading',
        lockKey
      }
    }

    remainingTtl = await client.pttl(lockKey)
  }

  return {
    action: 'trailing',
    lockKey,
    delay: Math.max(0, remainingTtl)
  }
}

export async function attachThrottleLeadingJob ({ client, lockKey, ref }) {
  if (!lockKey) return

  const remainingTtl = await client.pttl(lockKey)
  if (remainingTtl <= 0) return

  await client.set(lockKey, serializeJobRef(ref), 'PX', remainingTtl)
}

function getThrottleLockKey (deduplication) {
  return `${getRuntimeOptions().queuePrefix}:worker:${deduplication.id}`
}
