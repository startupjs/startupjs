module.exports = Object.assign({},
  require('@startupjs/react-sharedb-util'),
  require('@startupjs/react-sharedb-hooks'),
  require('@startupjs/react-sharedb-classes'),
  {
    $root: require('@startupjs/model'),

    // DEPRECATED! Use $root instead.
    model: require('@startupjs/model')
  }
)
