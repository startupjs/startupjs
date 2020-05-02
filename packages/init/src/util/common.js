import richText from 'rich-text'
import Racer from 'racer'
import RacerRemoteDoc from 'racer/lib/Model/RemoteDoc'
import batch from './batch'
import ormPlugin from '@startupjs/orm'

export default (ShareDB, { orm } = {}) => {
  // Register rich-text type in ShareDB
  ShareDB.types.register(richText.type)

  // Mokney patch rich-text to properly work with racer
  let oldRemoteDocOnOp = RacerRemoteDoc.prototype._onOp
  RacerRemoteDoc.prototype._onOp = function () {
    if (this.shareDoc.type === richText.type) return
    return oldRemoteDocOnOp.apply(this, arguments)
  }

  // Add batching method
  Racer.Model.prototype.batch = batch

  if (orm) {
    Racer.use(ormPlugin)
    Racer.use(orm)
  }
}
