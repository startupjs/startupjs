import model from '@startupjs/model'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import init from '../../../packages/init/lib/native'
import orm from '../../model'
import App from './App'
import { Rooms, Room, CreateRoom, Login } from './pages'

init({ baseUrl: 'http://localhost:3000', orm })
window.model = model

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Rooms },
    { path: '/login', name: 'login', component: Login },
    { path: '/rooms/create', name: 'room_create', component: CreateRoom },
    { path: '/rooms/:roomId', name: 'room', component: Room }
  ]
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.name !== 'login' && !user.id) next({ name: 'login' })
  if (to.name === 'login' && user.id) next({ name: 'home' })
  else next()
})

createApp(App)
  .use(router)
  .directive('bind-racer', {
    beforeMount: function (el, binding, vnode) {
      const model = binding.value
      el.value = model.get()

      function handler (e) {
        model.set(e.target.value)
      }

      el.addEventListener('input', handler)
    },
    beforeUpdate: function (el, binding) {
      const model = binding.value
      el.value = model.get()
    }
  })
  .mount('#app')
