import 'startupjs/nodeRegister' // has to be the first import since it sets up file transformations and loaders
// all imports below must be async imports in order for nodeRegister to work properly
await import('./startupjs.config.js') // has to be second import
const { default: run } = await import('./server/index.js')
run()
