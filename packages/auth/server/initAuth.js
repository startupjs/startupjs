import auth from './auth'

/**
 * @example
*   initAuth(ee, {
*     strategies: {
*       local: {
*         init: LocalInit // like initLocal func in auth.js, fn for passport initialisation
*         config: {},
*         hooks: {}
*       },
*       google: {
*         init: GoogleInit // like initGoogle func in auth.js, fn for passport initialisation
*         config: { clientId: '1234' },
*         hooks: {}
*       }
*     },
*     // ...other options
*   })
 */
export default function initAuth (ee, opts) {
  if (!opts) throw new Error('[@startupjs/auth] Provide options for auth module')

  // TODO: validate options init auth from './auth'
  // Something like this:
  ee.on('backend', async backend => {
    auth.init(backend, opts)
  })
  ee.on('afterSession', expressApp => {
    expressApp.use(auth.middleware())
  })
}
