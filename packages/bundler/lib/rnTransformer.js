const upstreamTransformer = require('metro-react-native-babel-transformer')
const stylusTransformer = require('react-native-stylus-transformer')
const cssTransformer = require('react-native-css-transformer')
const babel = require('@babel/core')
const observerWrapperPlugin = require('./babel-plugin-observer-wrapper')

module.exports.transform = function ({ src, filename, options }) {
  if (/\.styl$/.test(filename)) {
    return stylusTransformer.transform({ src, filename, options })
  } else if (/\.css$/.test(filename)) {
    return cssTransformer.transform({ src, filename, options })
  } else if (/\.jsx?$/.test(filename)) {
    // Fix Fast Refresh to work with observer() decorator
    //
    // INFO:
    //
    // The problem seems to be with observer() creating an additional
    // wrapper react component to host Suspense and ContextMeta.
    // While it also makes the target Component observable at the
    // same time.
    //
    // Creation of an additional wrapper component with only one
    // function observer() seems to confuse Fast Refresh and it loses state
    // of such components.
    //
    // The temporary solution for this (until it is fixed in react-native)
    // is to separate observer() into 2 functions:
    //   1. observer.__wrapObserverMeta() -- wraps component into an
    //      additional component with Suspense and ContextMeta
    //   2. observer.__makeObserver() -- modifies component to become
    //      observable
    //
    // So the following transformation transforms code the following way:
    //   observer(App)
    //     V V V
    //   observer.__wrapObserverMeta(observer.__makeObserver(App))
    //
    // It's important to make this transformation as a separate step before
    // the usual babel transformation fires. Otherwise, if you put it
    // into a generic babel.config.js list of plugins, Fast Refresh
    // will still not properly work.
    //
    // It makes sense to only do this in development
    if (process.env.NODE_ENV !== 'production') {
      src = babel.transformSync(src, {
        configFile: false,
        babelrc: false,
        plugins: [[ observerWrapperPlugin ]]
      }).code
    }

    return upstreamTransformer.transform({ src, filename, options })
  } else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}
