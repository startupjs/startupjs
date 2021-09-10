import model from '@startupjs/model'
import App from './App'
import init from '../../../packages/init/lib/native'
import orm from '../../model'

init({ baseUrl: 'http://localhost:3000', orm })
window.model = model

const app = new App({ target: document.getElementById('app') })
window.app = app
