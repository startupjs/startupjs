import React from 'react'
import { observer } from 'startupjs'

import { process } from '@startupjs/babel-plugin-rn-stylename-to-style/process'
import CustomIconExample from '@startupjs/ui/components/Icon/CustomIconExample.svg'

export default {
  // important
  React: React,
  observer: observer,

  // hacks
  require: () => ({ process }), // "import { styl }" transpile to require('...').process
  CustomIconExample: CustomIconExample // import svg is working with files only
}
