// Register the node loader which actually processes custom file extensions
// and pre-processes .js source code
import { register } from 'node:module'

register('./nodeLoader.mjs', import.meta.url)
