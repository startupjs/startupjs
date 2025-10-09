import createRegistry from './createRegistry.js'
import { ROOT_MODULE_NAME, getImportProps } from './constants.js'
// TODO: For now we are using the client registry for both client and server
//       which leads to react being used on the server.
//       We need to use client registry only on the client.
//       For this we need to alias the following imports through babel:
//         - startupjs/registry -> startupjs/registry/client
//         - @startupjs/registry -> @startupjs/registry/client
import ClientRegistry from './client/ClientRegistry.js'

// a bit hacky but encapsulated way (since we are using Symbols)
// to reuse the same code for client and server
// by exploiting the globalThis object to pass the client-only overrides
const { RegistryClass = ClientRegistry } = getImportProps()

export const {
  registry,
  ROOT_MODULE, // root module ('startupjs' framework itself)
  getModule,
  createPlugin,
  getPlugin,
  createModule,
  initRegistry
} = createRegistry({ RegistryClass, rootModuleName: ROOT_MODULE_NAME })
