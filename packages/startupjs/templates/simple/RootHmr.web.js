// Wrapper component, required to enable Hot Module Replacement for web in development mode.
// It doesn't affect performance in production build.
import { hot } from 'react-hot-loader/root'
import Root from './Root'

export default hot(Root)
