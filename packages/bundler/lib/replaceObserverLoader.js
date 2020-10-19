const OBSERVER_REGEX = /(^|\W)observer\(/
const OBSERVER_REPLACE = 'observer.__wrapObserverMeta(observer.__makeObserver('
const OPTIONS_ANCHORS = ['forwardRef:', 'suspenseProps:']

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

module.exports = function replaceObserverLoader (source) {
  let match = source.match(OBSERVER_REGEX)
  if (!match) return source
  let matchIndex = match.index
  let matchStr = match[0]
  let matchLength = matchStr.length
  let openBr = 1 // Count opened brackets, we start from one already opened
  let lastCloseCurlyBrIndex
  let prevCloseCurlyBrIndex

  // Track when we are inside a comment
  let inBlockComment = false
  let inLineComment = false

  for (let i = matchIndex + matchLength; i < source.length; i++) {
    const prevChar = (i > 0 ? source.charAt(i - 1) : '')
    const char = source.charAt(i)
    const lastTwoChars = `${prevChar}${char}`

    // Handle comments (ignore any chars inside them)

    // - exit comment

    if (inBlockComment) {
      if (lastTwoChars === '*/') inBlockComment = false
      continue
    }

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    // // - enter comment

    if (lastTwoChars === '/*') {
      inBlockComment = true
      continue
    }

    if (lastTwoChars === '//') {
      inLineComment = true
      continue
    }

    // Brackets counting logic

    if (char === ')') {
      --openBr
    } else if (char === '(') {
      ++openBr
    } else if (char === '}') {
      prevCloseCurlyBrIndex = lastCloseCurlyBrIndex
      lastCloseCurlyBrIndex = i
    }

    if (openBr <= 0) {
      let options = ''
      let hasOptions = false

      if (prevCloseCurlyBrIndex) {
        for (const anchor of OPTIONS_ANCHORS) {
          if (source.slice(prevCloseCurlyBrIndex, i).includes(anchor)) {
            hasOptions = true
            break
          }
        }
      }

      if (hasOptions) {
        options = source.slice(prevCloseCurlyBrIndex + 1, lastCloseCurlyBrIndex + 1)
      }

      source = source.slice(0, i) + ')' + options + source.slice(i)
      break
    }
  }

  source = source.replace(OBSERVER_REGEX, '$1' + OBSERVER_REPLACE)
  return replaceObserverLoader(source)
}
