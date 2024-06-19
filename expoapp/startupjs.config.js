// import React from 'react'
import { createPlugin } from 'startupjs/registry'
// import { pug, styl, $, observer } from 'startupjs'
// import { Span, Div, Button, alert } from '@startupjs/ui'
// import express from 'express'

// const plugins = createPlugins()

export default {
  plugins: {
    // [plugins.banner]: {
    //   client: {
    //     message: 'Startupjs app',
    //     defaultVisible: false
    //   }
    // }
  }
}

// This is a dummy plugin that adds a banner to the root module's renderRoot hook
function createPlugins () {
  return {
    banner: createPlugin({
      name: 'demo-banner',
      order: 'ui'
      // server: ({
      //   static: (expressApp) => {
      //     expressApp.use('/assets1', express.static('assets1'))
      //   }
      // })
    })
  }
}
