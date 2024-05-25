import { dirname } from 'path'
import { fileURLToPath } from 'url'

// this is __dirname of current folder only
export const __dirname = dirname(fileURLToPath(import.meta.url))
