import ShareDB from 'sharedb'
// isomorphic ShareDB initialization
import commonInit from '../util/common.js'

export default (options = {}) => {
  commonInit(ShareDB, options)
}
