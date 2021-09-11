export default function wrapCode (code) {
  return `
    import axios from 'axios' // ------ need remove!!!
    import { styl } from 'startupjs'

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          hasError: false,
          errorMessage: ''
        };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true }
      }

      componentDidCatch(error) {
        this.setState({
          hasError: true,
          errorMessage: error
        })
      }

      render() {
        if (this.state.hasError) {
          return pug\`
            Text(style={ color: 'red', fontFamily: 'monospace' })
              = this.state.errorMessage.toString()
          \`;
        }

        return this.props.children;
      }
    }

    function getComponent () {
      const Example = observer(()=> {
        ${code}
      })

      return pug\`
        ErrorBoundary
          Example
      \`
    }
  `
}
