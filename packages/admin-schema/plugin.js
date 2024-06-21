import { createPlugin } from 'startupjs/registry'
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable'
import { BASE_URL } from './isomorphic/constants.js'
import files from './server/files.js'
import getFile from './server/getFile.js'
import Page from './client/Page.js'

export const startupjsPlugin = createPlugin({
  name: 'admin-schema',
  enabled: true,
  server: () => ({
    api: expressApp => {
      expressApp.get(`${BASE_URL}/files`, files)
      expressApp.get(`${BASE_URL}/file/:filename`, getFile)
    }
  })
})

export default createPlugin({
  name: 'schema',
  for: 'admin',
  enabled: true,
  client: () => ({
    routes: () => [
      { path: 'schema', element: <Page /> }
    ],
    menuItems: () => [
      { to: 'schema', name: 'Schema', icon: faTable }
    ]
  })
})
