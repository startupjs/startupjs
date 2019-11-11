export default async (backend, CRITICAL_VERSION) => {
  if (!CRITICAL_VERSION) return
  const model = backend.createModel({ fetchOnly: true })
  const $version = model.at('service.version')
  await $version.subscribeAsync()
  const version = $version.get()

  if (!version) {
    await model.addAsync('service', {
      id: 'version',
      criticalVersion: CRITICAL_VERSION
    })
  } else {
    $version.setDiffDeepAsync('criticalVersion', { ...CRITICAL_VERSION })
  }

  backend.CRITICAL_VERSION = CRITICAL_VERSION
  console.log('Critical version:', JSON.stringify(CRITICAL_VERSION, null, 2))
  model.close()
}
