import React from 'react'
import { createPlugin } from 'startupjs/registry'
import { pug, styl, $, sub, observer } from 'startupjs'
import { Span, Div, Button, alert } from '@startupjs/ui'
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
