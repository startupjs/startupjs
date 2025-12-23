const onInitSessionHandlers = new Set()

export function onInitSession (cb) { onInitSessionHandlers.add(cb) }

export async function emitInitSession (session) {
  for (const handler of onInitSessionHandlers) {
    const promise = handler(session)
    if (promise?.then) await promise
  }
}
