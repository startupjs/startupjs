import conf from 'nconf'

export default function (req, res) {
  const { name } = req.params
  const { secret = null } = req.body

  console.log(name, req.body)
  if (!secret || secret !== conf.get('MIGRATION_SECRET')) {
    return res.status(403).send('Restricted access!')
  }

  // Ignore dynamic webpack require
  /* eslint-disable */
  const requireFunc =
    typeof __webpack_require__ === 'function'
      ? __non_webpack_require__
      : require
  /* eslint-enable */

  const migration = requireFunc(`../migrations/${name}.cjs`)

  const model = req.model
  console.log(`>>>>>>> RUN MIGRATION ${name} <<<<<<<`)
  migration(model, { ...req.query }).then((result) => {
    console.log(`>>>>>>> END MIGRATION ${name} <<<<<<<`)
    res.json(result || true)
  })
}
