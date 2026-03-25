import React from 'react'
import { createPlugin } from 'startupjs/registry'
import { pug, styl, $, sub, observer } from 'startupjs'
import { Span, Div, Button, alert } from 'startupjs-ui'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'

const $banner = $.session.banner

const plugins = createPlugins()

export default {
  features: {
    enableOAuth2: true,
    accessControl: true
  },
  client: {
    init: () => {
      globalThis.$ = $
      globalThis.sub = sub
    }
  },
  server: {
    init: () => {
      if (process.env.SKIP_SERVER_INIT_SIDE_EFFECTS === 'true') return

      // test the serverOnly on the 'secrets' collection (whole class) and documents (methods)
      setTimeout(async () => {
        const $secrets = await sub($.secrets, {})
        $.secrets.printSalt()
        for (const $secret of $secrets) $secret.printWithSalt()
      }, 1000)
    }
  },
  plugins: {
    [plugins.banner]: {
      client: {
        message: 'Startupjs app',
        defaultVisible: false
      }
    },
    auth: {
      client: {
        redirectUrl: '/two'
      }
    }
  }
}

// This is a dummy plugin that adds a banner to the root module's renderRoot hook
function createPlugins () {
  return {
    banner: createPlugin({
      name: 'demo-banner',
      order: 'ui',
      client: ({
        message = 'default banner message',
        defaultVisible = true
      }) => {
        // This will be executed once during plugin init.
        // NOTE: if module uses dynamicPlugins, the init function will be executed
        //       every time the plugins/onlyPlugins option changes.
        //       So it's important to make the initialization logic idempotent if possible.
        $banner.visible.set(defaultVisible)
        // return actual hooks for the root module
        return {
          renderRoot ({ children }) {
            return <>
              {children}
              <Banner {...{ message, defaultVisible }} />
            </>
          }
        }
      }
    }),
    workerTestJobs: createPlugin({
      name: 'worker-test-jobs',
      enabled: true,
      server: () => ({
        workerJobs (existingJobs = {}) {
          const jobs = { ...existingJobs }

          if (process.env.ENABLE_WORKER_INTEGRATION_PLUGIN !== 'true') return jobs

          jobs.integrationPluginJob = {
            default: async function integrationPluginJob (data) {
              return {
                from: 'plugin',
                data
              }
            }
          }

          jobs.integrationPluginAsync = import('./server/workerJobs/integrationPluginAsync.js')

          jobs.integrationPluginCron = {
            default: async function integrationPluginCron (data) {
              return data
            },
            worker: 'priority',
            cron: {
              pattern: '*/10 * * * * *',
              data: { source: 'integrationPluginCron' }
            }
          }

          if (process.env.WORKER_TEST_ENABLE_EXTRA_PLUGIN_CRON === 'true') {
            jobs.integrationPluginCronTransient = {
              default: async function integrationPluginCronTransient (data) {
                return data
              },
              cron: {
                pattern: '*/10 * * * * *',
                data: { source: 'integrationPluginCronTransient' }
              }
            }
          }

          switch (process.env.WORKER_TEST_INVALID_JOB) {
            case 'worker':
              jobs.integrationPluginInvalidWorker = {
                default: async function integrationPluginInvalidWorker () {},
                worker: 'does-not-exist'
              }
              break
            case 'cron':
              jobs.integrationPluginInvalidCron = {
                default: async function integrationPluginInvalidCron () {},
                cron: { pattern: 42 }
              }
              break
            case 'singleton':
              jobs.integrationPluginInvalidSingleton = {
                default: async function integrationPluginInvalidSingleton () {},
                singleton: 'not-valid'
              }
              break
          }

          return jobs
        }
      })
    })
  }
}

const Banner = observer(({ children, message }) => {
  return pug`
    Div.root(row vAlign='center' styleName={ hide: !$banner.visible.get() })
      Div(full row vAlign='center')
        Span= message
        Button(
          color='text-description' variant='text' icon=faInfoCircle
          onPress=() => alert({ title: 'Banner', message })
        )
      Button(
        color='text-description' variant='text' icon=faTimes
        onPress=() => $banner.visible.set(false)
      )
  `
  styl`
    .root
      padding 0 1u 0 2u
      background-color var(--color-bg-main-subtle)
      color var(--color-text-description)
      &.hide
        display none
  `
})
