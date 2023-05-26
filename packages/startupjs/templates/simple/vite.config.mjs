import startupjsPlugin from '@startupjs/vite-plugin-startupjs'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    startupjsPlugin()
  ]
})
