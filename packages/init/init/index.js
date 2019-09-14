// generic fallback client initialization (web-based)

import ShareDB from 'sharedb/lib/client'
// isomorphic ShareDB initialization
import commonInit from './common'

export default () => commonInit(ShareDB)
