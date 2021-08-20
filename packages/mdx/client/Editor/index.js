import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import axios from 'axios'

import ace from './build/string'
import mode from './build/mode'

import scope from './helpers/scope'
import wrapCode from './helpers/wrapCode'
import './index.styl'

function escapeRegExp (string) {
  return string.replace(/[.*+?^$`{}()|[\]\\]/g, '\\$&')
}

// fix import to string modules?
// fix scroll in WebView
// write errors message
export default function ({ value }) {
  const [code, setCode] = useState(value)
  const [jsx, setJsx] = useState(null)

  // string code to jsx
  useEffect(() => {
    (async () => {
      try {
        let _code = code.replace(/import(.+)\n/gi, '')
        _code = wrapCode(_code)

        let tcode = await axios.post('/api/code-parse', { code: _code })
        tcode = tcode.data
        tcode += '\n return getComponent()'

        // eslint-disable-next-line
        const generator = new Function(Object.keys(scope), tcode)
        const newJsx = generator(...Object.values(scope))
        setJsx(newJsx)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [code])

  const html = `
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=no"
        />
      </head>
      <body>
        <div id="editor"></div>

        <script>
          ${ace}
          \n\n${mode}
          \n\n
          var editor = ace.edit('editor');

          editor.setOptions({
            theme: 'ace/theme/chrome',
            mode: 'ace/mode/javascript',
            minLines: 2,
            maxLines: 50
          })

          editor.session.on('change', function () {
            var code = editor.session.getValue()
            window.ReactNativeWebView.postMessage(code);
          })

          editor.session.setValue(\`${escapeRegExp(value)}\`);
          editor.resize(true);
        </script>
      </body>
    </html>
  `

  return pug`
    View.example= jsx
    WebView(
      source={ html }
      style={ height: 120, width: 300 }
      onMessage=e=> setCode(e.nativeEvent.data)
    )
  `
}
