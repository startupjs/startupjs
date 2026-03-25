import { join } from 'path'
import { defineConfig } from '@rspress/core'

export default defineConfig({
  root: 'docs',
  themeDir: join(__dirname, 'docs-theme'),
  title: 'StartupJS',
  description: 'StartupJS fullstack framework',
  route: { cleanUrls: true },
  markdown: { link: { checkDeadLinks: false } },
  themeConfig: {
    enableContentAnimation: true,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/startupjs/startupjs' }
    ],
    footer: { message: '© 2026 StartupJS. All Rights Reserved.' },
    hideNavbar: 'auto',
    sidebar: {
      '/': [
        {
          text: 'Tutorial',
          items: [
            { text: 'Quickstart', link: '/tutorial/foundation' },
            { text: 'To-Do App', link: '/tutorial/basics' },
            { text: 'Observer Pattern', link: '/tutorial/observer' },
            { text: 'Signals & Subscriptions', link: '/tutorial/sharedbHooks' },
            { text: 'Signals API', link: '/tutorial/racerModel' },
            { text: 'Project Structure', link: '/tutorial/fileStructure' },
            { text: 'Pug', link: '/tutorial/pug' },
            { text: 'Stylus', link: '/tutorial/stylus' },
            { text: 'Tricks with Styles', link: '/tutorial/tricksWithStyles' }
          ]
        },
        {
          text: 'Docs',
          items: [
            { text: 'Border Radius', link: '/foundations/borderRadius' },
            { text: 'Collection Types', link: '/foundations/collectionTypes' },
            { text: 'Colors', link: '/foundations/colors' },
            { text: 'Color Customization', link: '/foundations/colorCustomization' },
            { text: 'Editing Patterns', link: '/foundations/editing' },
            { text: 'Export CSS to JS', link: '/foundations/exportCSStoJS' },
            { text: 'Caching node_modules', link: '/foundations/nodeModulesCache' },
            { text: 'Security', link: '/foundations/security' },
            { text: 'WebSocket', link: '/foundations/websocket' },
            { text: 'E2E Testing', link: '/foundations/e2e-tests' }
          ]
        },
        {
          text: 'General',
          items: [
            { text: 'Plugins', link: '/general/plugins' },
            { text: 'Hooks', link: '/general/hooks' },
            { text: 'Models', link: '/general/models' },
            { text: 'About Modules', link: '/general/about-modules' },
            { text: 'Create Plugin', link: '/general/create-plugin' },
            { text: 'Experimental Hooks', link: '/general/experimental-hooks' }
          ]
        },
        {
          text: 'Libraries',
          items: [
            { text: '@startupjs/worker', link: '/libraries/startupjs-worker' },
            { text: '@startupjs/router', link: '/libraries/startupjs-router' }
          ]
        },
        {
          text: 'Migration Guides',
          collapsed: true,
          items: [
            { text: '0.62', link: '/migration-guides/0.62' },
            { text: '0.61', link: '/migration-guides/0.61' },
            { text: '0.55', link: '/migration-guides/0.55' },
            { text: '0.54', link: '/migration-guides/0.54' },
            { text: '0.53', link: '/migration-guides/0.53' },
            { text: '0.52', link: '/migration-guides/0.52' },
            { text: '0.51', link: '/migration-guides/0.51' },
            { text: '0.50', link: '/migration-guides/0.50' },
            { text: '0.49', link: '/migration-guides/0.49' },
            { text: '0.48', link: '/migration-guides/0.48' },
            { text: '0.47', link: '/migration-guides/0.47' },
            { text: '0.46', link: '/migration-guides/0.46' },
            { text: '0.45', link: '/migration-guides/0.45' },
            { text: '0.44', link: '/migration-guides/0.44' },
            { text: '0.43', link: '/migration-guides/0.43' },
            { text: '0.42', link: '/migration-guides/0.42' },
            { text: '0.41', link: '/migration-guides/0.41' },
            { text: '0.40', link: '/migration-guides/0.40' },
            { text: '0.39', link: '/migration-guides/0.39' },
            { text: '0.38', link: '/migration-guides/0.38' },
            { text: '0.37', link: '/migration-guides/0.37' },
            { text: '0.36', link: '/migration-guides/0.36' },
            { text: '0.35', link: '/migration-guides/0.35' },
            { text: '0.34', link: '/migration-guides/0.34' },
            { text: '0.33', link: '/migration-guides/0.33' },
            { text: '0.32', link: '/migration-guides/0.32' },
            { text: '0.31', link: '/migration-guides/0.31' },
            { text: '0.30', link: '/migration-guides/0.30' },
            { text: '0.29', link: '/migration-guides/0.29' },
            { text: '0.28', link: '/migration-guides/0.28' },
            { text: '0.27', link: '/migration-guides/0.27' },
            { text: '0.26', link: '/migration-guides/0.26' },
            { text: '0.25', link: '/migration-guides/0.25' },
            { text: '0.24', link: '/migration-guides/0.24' },
            { text: '0.23', link: '/migration-guides/0.23' }
          ]
        }
      ]
    },
    nav: [
      { text: 'Tutorial', link: '/tutorial/foundation', activeMatch: '/tutorial/.*' },
      { text: 'Docs', link: '/foundations/borderRadius', activeMatch: '/(foundations|general)/.*' }
    ]
  }
})
