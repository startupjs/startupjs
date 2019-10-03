const upstreamTransformer = require('metro-react-native-babel-transformer')
const stylusTransformer = require('react-native-stylus-transformer')
const cssTransformer = require('react-native-css-transformer')

module.exports.transform = function ({ src, filename, options }) {
  if (/\.styl$/.test(filename)) {
    return stylusTransformer.transform({ src, filename, options })
  } else if (/\.css$/.test(filename)) {
    return cssTransformer.transform({ src, filename, options })
  } else if (/\.jsx?$/.test(filename) && /['"]startupjs['"]/.test(src)) {
    // Fix Fast Refresh to work with observer() decorator
    // NOTE:
    //
    // Exclude node_modules/react-native since it has some
    // non-standard stuff in it not supported by default babel
    // and only working correctly when plugging in the whole
    // preset 'module:metro-react-native-babel-preset'
    // (it might be because of flow, but I'm not sure),
    // which we don't want to do.
    // We might have to exclude whole node_modules though,
    // depending on whether other community modules would have
    // such non-standard stuff.
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
    src = src.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:^\s*\/\/(?:.*)$)/gm, '')
    src = replaceObserver(src)

    return upstreamTransformer.transform({ src, filename, options })
  } else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}

const OBSERVER_REGEX = /(^|\W)observer\(/
const OBSERVER_REPLACE = 'observer.__wrapObserverMeta(observer.__makeObserver('

function replaceObserver (src) {
  let match = src.match(OBSERVER_REGEX)
  if (!match) return src
  let matchIndex = match.index
  let matchStr = match[0]
  let matchLength = matchStr.length
  let openBr = 1 // Count opened brackets, we start from one already opened
  for (let i = matchIndex + matchLength; i < src.length; i++) {
    if (src.charAt(i) === ')') {
      --openBr
    } else if (src.charAt(i) === '(') {
      ++openBr
    }
    if (openBr <= 0) {
      src = src.slice(0, i) + ')' + src.slice(i)
      break
    }
  }
  src = src.replace(OBSERVER_REGEX, '$1' + OBSERVER_REPLACE)
  return replaceObserver(src)
}
