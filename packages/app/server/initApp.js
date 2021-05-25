export default async function initApp (ee, criticalVersion) {
  if (criticalVersion) {
    ee.on('backend', async backend => {
      const model = backend.createModel()
      const $version = model.at('service.version')
      await $version.subscribe()
      const version = $version.get()

      if (!version) {
        await model.addAsync('service', {
          id: 'version',
          criticalVersion
        })
      } else {
        await $version.setDiffDeep('criticalVersion', criticalVersion)
      }

      console.log('Critical version:', JSON.stringify(criticalVersion, null, 2))
      model.close()
    })
  }

  ee.on('routes', expressApp => {
    expressApp.get('/api/serverSession', function (req, res) {
      const restoreUrl = req.session.restoreUrl

      if (restoreUrl) {
        delete req.session.restoreUrl
        req.model.set('_session.restoreUrl', restoreUrl)
      }

      return res.json(req.model.get('_session'))
    })

    expressApp.post('/api/restore-url', function (req, res) {
      const { restoreUrl } = req.body
      req.session.restoreUrl = restoreUrl
      res.sendStatus(200)
    })
  })
}
