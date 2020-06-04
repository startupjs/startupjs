module.exports = Object.assign({},
  require('@startupjs/react-sharedb'),
  require('@startupjs/hooks'),
  // HINT: `isomorphic` means that the code can be executed both
  //        on the server and on the client
  require('@startupjs/isomorphic-helpers')
)
