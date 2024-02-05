import React from 'react'
import { createPlugin } from 'startupjs/registry'
import { pug, styl, $, observer } from 'startupjs'
import { Span, Div, Button } from '@startupjs/ui'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'

const $banner = $.session.banner

const plugins = createPlugins()

export default {
  isomorphic: {
    server: true
  },
  server: {
    init: options => ({
      api: expressApp => {
        expressApp.get('/hello', (req, res) => {
          res.send('Hello from server')
        })
      }
    })
  },
  plugins: {
    [plugins.banner]: {
      client: {
        message: 'Startupjs app',
        defaultVisible: false
      }
    }
  }
}

// This is a dummy plugin that adds a banner to the root module's renderRoot hook
function createPlugins () {
  return {
    banner: createPlugin({
      name: 'demo-banner',
      client: ({
        message = 'default banner message',
        defaultVisible = true
      }) => {
        // This will be executed once during plugin init.
        // NOTE: if module uses dynamicPlugins, the init function will be executed
        //       every time the plugins/onlyPlugins option changes.
        //       So it's important to make the initialization logic idempotent if possible.
        $banner.visible.setNull(defaultVisible)
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
      Span.text= message
      Button(color='text-description' variant='text' icon=faTimes onPress=() => $banner.visible.setDiff(false))
  `
  /* eslint-disable */styl`
    .root
      padding 0 1u 0 2u
      background-color var(--color-bg-main-subtle)
      color var(--color-text-description)
      &.hide
        display none
    .text
      flex 1
  `
})
