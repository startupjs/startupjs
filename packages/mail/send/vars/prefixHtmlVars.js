export default function prefixHtmlVars (prefix, html) {
  if (!prefix) {
    throw new Error(
      '[@startupjs/mail] prefixHtmlVars: ' +
      'prefix parameter is required!'
    )
  }

  if (typeof html !== 'string') {
    throw new Error(
      '[@startupjs/mail] prefixHtmlVars: ' +
      'html parameter must be a string with html markup!'
    )
  }

  // TODO: replace vars with prefixed
  return html
}
