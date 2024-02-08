import orm from '@startupjs/orm'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import richText from 'rich-text'
import Racer from 'racer'
import RacerRemoteDoc from 'racer/lib/Model/RemoteDoc.js'
import batch from './batch.js'

export default (ShareDB, { orm: ormModels } = {}) => {
  // Register rich-text type in ShareDB
  ShareDB.types.register(richText.type)

  // Mokney patch rich-text to properly work with racer
  const oldRemoteDocOnOp = RacerRemoteDoc.prototype._onOp
  RacerRemoteDoc.prototype._onOp = function () {
    if (this.shareDoc.type === richText.type) return
    return oldRemoteDocOnOp.apply(this, arguments)
  }

  // Add batching method
  Racer.Model.prototype.batch = batch

  Racer.use(orm)
  // TODO: DEPRECATED: Use new plugins system instead
  if (ormModels) Racer.use(ormModels)
  MODULE.hook('orm', Racer)
}
