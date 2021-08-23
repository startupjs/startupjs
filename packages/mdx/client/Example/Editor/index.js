import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { observer, useApi } from 'startupjs'
import axios from 'axios'
import './index.styl'

function escapeRegExp (string) {
  return string.replace(/[.*+?^$`{}()|[\]\\]/g, '\\$&')
}

export default observer(function ({ initValue, onChangeCode }) {
  const [webViewHeight, setWebViewHeight] = useState(100)
  const [deps] = useApi(async () => {
    const res = await axios.get('/api/get-deps-string')
    return res.data
  }, [])

  const html = `
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=no"
        />
      </head>
      <body>
        <div id='editor'></div>

        <script>
          ${deps}
          \n\n

          const editor = ace.edit('editor');

          editor.setOptions({
            theme: 'ace/theme/chrome',
            mode: 'ace/mode/startupjs',
            minLines: 2,
            maxLines: 1000,
            value: \`${escapeRegExp(initValue)}\`,
            resize: true
          })

          editor.session.on('change', function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'code',
              code: editor.session.getValue()
            }));
            updateHeight();
          })

          function updateHeight() {
            const newHeight = editor.session.getLength() * 17;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'height',
              height: newHeight
            }));
          }

          updateHeight();
        </script>
      </body>
    </html>
  `

  function onMessage (e) {
    const data = JSON.parse(e.nativeEvent.data)
    if (data.type === 'code') onChangeCode(data.code)
    if (data.type === 'height') setWebViewHeight(data.height)
  }

  return pug`
    WebView(
      source={ html }
      style={
        height: webViewHeight,
        width: Dimensions.get('window').width
      }
      onMessage=onMessage
    )
  `
})
