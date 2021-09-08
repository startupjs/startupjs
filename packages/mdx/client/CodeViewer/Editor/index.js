import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { observer, useSession } from 'startupjs'
import axios from 'axios'
import escapeRegExp from '../helpers/escapeRegExp'
import prepareLanguage from '../helpers/prepareLanguage'

function Editor ({
  initValue,
  language = '',
  readOnly,
  onChangeCode
}) {
  const [webViewHeight, setWebViewHeight] = useState(1)
  const [deps, $deps] = useSession('_editor.deps')

  useEffect(() => {
    if ($deps.get()) return
    (async () => {
      const res = await axios.get('/api/get-deps-string')
      $deps.set(res.data)
    })()
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
            minLines: 2,
            maxLines: 1000,
            value: \`${escapeRegExp(initValue)}\`,
            resize: true
          })

          if (${readOnly}) {
            editor.setOption('minLines', 1)
            editor.setReadOnly(true)
            editor.setHighlightActiveLine(false)
            editor.setHighlightGutterLine(false)
            editor.setOption('showGutter', false)
            editor.container.style.background = '#f5f5f5'
            editor.renderer.$cursorLayer.element.style.display = 'none'
            editor.setOption('mode', 'ace/mode/${prepareLanguage(language)}')
          } else {
            editor.container.style.background = "#efefef"
            editor.setOption('mode', 'ace/mode/startupjs')
          }

          editor.session.on('change', function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'code',
              code: editor.session.getValue()
            }));
            updateHeight();
          })

          function updateHeight() {
            const newHeight = editor.session.getLength() * 14;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'height',
              height: newHeight
            }));
          }

          setTimeout(updateHeight, 300);
        </script>

        <style>
          * { padding: 0; margin: 0; }
        </style>
      </body>
    </html>
  `

  function onMessage (e) {
    const data = JSON.parse(e.nativeEvent.data)
    if (data.type === 'code') onChangeCode && onChangeCode(data.code)
    if (data.type === 'height') setWebViewHeight(data.height)
  }

  if (!deps) return null
  return pug`
    View(style={ height: webViewHeight })
      WebView(
        source={ html }
        onMessage=onMessage
      )
  `
}

export default observer(Editor)
