import ShareDB from 'sharedb/lib/client'
// isomorphic ShareDB initialization
import commonInit from '../util/common'
import connectModel from '../util/connectModel'

export default (options) => {
  commonInit(ShareDB, options)
  connectModel()
}
