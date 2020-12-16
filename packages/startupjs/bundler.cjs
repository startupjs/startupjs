throw new Error(`
[startupjs/bundler] ERROR! StartupJS bundler api has changed.

Now instead of using general \`require('startupjs/bundler.cjs')\` you have to require
a specific file you need.

Here is what you need to change:

1. \`require('startupjs/bundler.cjs').webpackWebConfig\`
    v v v
   \`require('startupjs/bundler/webpack.web.config.cjs')\`

2. \`require('startupjs/bundler.cjs').webpackServerConfig\`
    v v v
   \`require('startupjs/bundler/webpack.server.config.cjs')\`

3. \`require('startupjs/bundler.cjs').babelConfig\`
    v v v
   \`require('startupjs/bundler/babel.config.cjs')\`

4. \`require('startupjs/bundler.cjs').metroConfig\`
    v v v
   \`require('startupjs/bundler/metro.config.cjs')\`

5. \`require('startupjs/bundler.cjs').rnConfig\`
    v v v
   \`require('startupjs/bundler/react-native.config.cjs')\`

6. \`require('startupjs/bundler.cjs').viteConfig\`
    v v v
   \`require('startupjs/bundler/vite.config.cjs')\`

Additionally, if you did override .js/.jsx compilation in your webpack.web.config.cjs, you
might have used \`getJsxRule\` function there. In which case you should now get it from helpers:

7. \`const { getJsxRule } = require('startupjs/bundler.cjs')\`
    v v v
   \`const { getJsxRule } = require('startupjs/bundler/helpers.cjs')\`
`)
