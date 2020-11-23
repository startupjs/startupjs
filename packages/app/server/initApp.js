export default async function initApp (backend, criticalVersion) {
  if (!criticalVersion) return
  const model = backend.createModel({ fetchOnly: true })
  const $version = model.at('service.version')
  await $version.subscribe()
  const version = $version.get()

  if (!version) {
    await model.addAsync('service', {
      id: 'version',
      criticalVersion
    })
  } else {
    await $version.setDiffDeep('criticalVersion', { ...criticalVersion })
  }

  console.log('Critical version:', JSON.stringify(criticalVersion, null, 2))
  model.close()
}
