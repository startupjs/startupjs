export default function wrapCode (code) {
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
