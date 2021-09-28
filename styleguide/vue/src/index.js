import model from '@startupjs/model'
import Vue from 'vue'
import Router from 'vue-router'
import init from '../../../packages/init/lib/native'
import orm from '../../model'
import App from './App'

init({ baseUrl: 'http://localhost:3000', orm })
window.model = model

Vue.use(Router)

new Vue({
  render: h => h(App),
  components: { App },
  template: '<App />'
}).$mount('#app')
