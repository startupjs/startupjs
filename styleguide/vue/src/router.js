import { createRouter, createWebHistory } from 'vue-router'
import { auth, main } from './apps'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...main
  ]
})

export default router
