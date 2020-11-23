export default async function initApp (backend, CRITICAL_VERSION) {
  if (!CRITICAL_VERSION) return
  const model = backend.createModel({ fetchOnly: true })
  const $version = model.at('service.version')
  await $version.subscribe()
  const version = $version.get()

  if (!version) {
    await model.addAsync('service', {
      id: 'version',
      criticalVersion: CRITICAL_VERSION
    })
  } else {
    await $version.setDiffDeep('criticalVersion', { ...CRITICAL_VERSION })
  }

  backend.CRITICAL_VERSION = CRITICAL_VERSION
  console.log('Critical version:', JSON.stringify(CRITICAL_VERSION, null, 2))
  model.close()
}
