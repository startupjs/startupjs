export default function viteStartupjsHtml () {
  return {
    name: 'startupjs:html',
    transformIndexHtml (html) {
      return html.replace(/(<head>)/, '$1' + BROWSERIFY_POLYFILL)
    }
  }
}

// This polyfill is required for racer and sharedb. They check whether
// they execute in the browser environment by checking whether
// process.title is 'browser'
const BROWSERIFY_POLYFILL = `
  <script>
    /* Polyfill for browserify */
    if (typeof global === 'undefined') global = {};
    if (typeof process === 'undefined') process = {};
    process.title = 'browser';
  </script>
`
