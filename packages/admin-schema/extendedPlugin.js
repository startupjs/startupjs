import { createPlugin } from 'startupjs/registry'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import ExtendedPage from './client/ExtendedPage.js'

export default createPlugin({
  name: 'extended-schema',
  for: 'admin',
  enabled: true,
  client: () => ({
    routes: () => [
      { path: 'extended', element: <ExtendedPage /> }
    ],
    menuItems: () => [
      { to: 'extended', name: 'Extended', icon: faPlus }
    ]
  })
})
