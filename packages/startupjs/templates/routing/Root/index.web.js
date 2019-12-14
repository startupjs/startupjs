import { hot } from 'react-hot-loader/root'
import App from './App'

// Connect hot-reloading for web.
// It will detect production usage and won't have any effect,
// so it's fine to have it in the main source code.
export default hot(App)
