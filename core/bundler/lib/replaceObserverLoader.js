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
  let lastOpenCurlyBrIndex

  // TODO: Improve figuring out that we are actually in a comment.
  //       It will bug out when someone is specifying 'http://'
  //       and other places inside strings.

  // // Track when we are inside a comment
  // let inBlockComment = false
  // let inLineComment = false

  for (let i = matchIndex + matchLength; i < source.length; i++) {
    const char = source.charAt(i)

    // TODO: Improve comments. See comment above for details.

    // // Handle comments (ignore any chars inside them)

    // const prevChar = (i > 0 ? source.charAt(i - 1) : '')
    // const lastTwoChars = `${prevChar}${char}`

    // // - exit comment

    // if (inBlockComment) {
    //   if (lastTwoChars === '*/') inBlockComment = false
    //   continue
    // }

    // if (inLineComment) {
    //   if (char === '\n') inLineComment = false
    //   continue
    // }

    // // - enter comment

    // if (lastTwoChars === '/*') {
    //   inBlockComment = true
    //   continue
    // }

    // if (lastTwoChars === '//') {
    //   inLineComment = true
    //   continue
    // }

    // Brackets counting logic

    switch (char) {
      case ')':
        --openBr
        break
      case '(':
        ++openBr
        break
      case '{':
        lastOpenCurlyBrIndex = i
        break
      case '}':
        lastCloseCurlyBrIndex = i
        break
    }

    if (openBr <= 0) {
      let options = ''

      if (lastOpenCurlyBrIndex && lastCloseCurlyBrIndex) {
        const sourceBetweenCurlyBrackets =
          source.slice(lastOpenCurlyBrIndex, lastCloseCurlyBrIndex + 1)

        for (const anchor of OPTIONS_ANCHORS) {
          if (sourceBetweenCurlyBrackets.includes(anchor)) {
            options = sourceBetweenCurlyBrackets
            break
          }
        }
      }

      if (options) options = ', ' + options

      source = source.slice(0, i) + ')' + options + source.slice(i)
      break
    }
  }

  source = source.replace(OBSERVER_REGEX, '$1' + OBSERVER_REPLACE)
  return replaceObserverLoader(source)
}
