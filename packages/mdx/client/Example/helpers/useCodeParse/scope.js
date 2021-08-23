import React from 'react'
import ReactNative from 'react-native'

import { u } from 'startupjs'
import * as startupjsHooks from '@startupjs/hooks'
import * as startupjsComponents from '@startupjs/ui'
import * as startupjsReactShareDB from '@startupjs/react-sharedb'

import { process } from '@startupjs/babel-plugin-rn-stylename-to-style/process'
import CustomIconExample from '@startupjs/ui/components/Icon/CustomIconExample.svg'
import * as icons from '@fortawesome/free-solid-svg-icons'

export default {
  // react
  React: React,
  ...React,
  ...ReactNative,

  // startupjs
  u: u,
  ...startupjsComponents,
  ...startupjsHooks,
  ...startupjsReactShareDB,
  ...icons,

  // hacks
  require: () => ({ process }), // "import { styl }" transpile to require('...').process
  CustomIconExample: CustomIconExample // import svg is working with files only
}
