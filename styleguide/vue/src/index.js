import model from '@startupjs/model'
import { createApp } from 'vue'
import naive from 'naive-ui'
import { directiveRacer } from 'helpers'
import App from './App'
import router from './router'
import init from '../../../packages/init/lib/native'
import orm from '../../model'

init({ baseUrl: 'http://localhost:3000', orm })
window.model = model

createApp(App)
  .use(router)
  .use(naive)
  .directive('bind-racer', directiveRacer)
  .mount('#app')
