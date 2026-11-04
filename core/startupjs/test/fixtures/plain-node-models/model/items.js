// A model that imports from the `startupjs` root, as app models do.
import { Signal, serverOnly } from 'startupjs'

export default class ItemsModel extends Signal {
  load = serverOnly(() => 'server')
}
