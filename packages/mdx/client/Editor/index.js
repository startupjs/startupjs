import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import AceEditor from 'react-ace'
import axios from 'axios'

// editor
import 'ace-builds/src-noconflict/mode-jade'
import 'ace-builds/src-noconflict/mode-stylus'
import 'ace-builds/src-noconflict/mode-javascript'
import './mode-startupjs'
import 'ace-builds/src-noconflict/theme-chrome'

import scope from './scope'
import '../mdxComponents/index.styl'

function wrapCode (code) {
  return `
    import axios from 'axios' // ------ need remove!!!
    import { styl } from 'startupjs'

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
    
      static getDerivedStateFromError(error) {
        return { hasError: true };
      }
    
      componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
      }
    
      render() {
        if (this.state.hasError) {
          return <h1>Something went wrong.</h1>;
        }
    
        return this.props.children;
      }
    }

    function getComponent () {
      const Example = observer(()=> {
        ${code}
      })

      return <ErrorBoundary><Example /></ErrorBoundary>
    }
  `
}

export default function ({ value }) {
  const [code, setCode] = useState(value)
  const [jsx, setJsx] = useState(null)

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

  return pug`
    View.example= jsx
    AceEditor(
      mode='startupjs'
      theme='chrome'
      value=code
      onChange=setCode
    )
  `
}
