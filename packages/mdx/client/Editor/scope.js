import React, * as reactHelpers from 'react'
import * as reactNative from 'react-native'

import { u } from 'startupjs'
import * as startupjsHooks from '@startupjs/hooks'
import * as startupjsComponents from '@startupjs/ui'
import * as startupjsReactShareDB from '@startupjs/react-sharedb'

import { process } from '@startupjs/babel-plugin-rn-stylename-to-style/process'
import * as icons from '@fortawesome/free-solid-svg-icons'

// need fix hacks
// import CustomIconExample from '@startupjs/ui/components/Icon/CustomIconExample.svg'

export default {
  // react
  React: React,
  ...reactHelpers,
  ...reactNative,

  // startupjs
  u: u,
  ...startupjsComponents,
  ...startupjsHooks,
  ...startupjsReactShareDB,
  ...icons,

  // need fix hacks
  require: () => ({ process })
}
