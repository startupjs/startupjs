<script>
  import VueRouter from 'vue-router';
  import { CreateRoom, Rooms, Room, Login } from './pages'
  import { Header, Content } from './components'

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', name: 'home', component: Rooms },
      { path: '/rooms/create', name: 'rooms_create', component: CreateRoom },
      { path: '/rooms/:roomId', name: 'room', component: Room },
      { path: '/login', name: 'login', component: Login }
    ]
  })

  router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !user.id) next({ name: 'login' })
    if (to.name === 'login' && user.id) next({ name: 'home' })
    else next()
  })

  export default {
    router,
    name: 'app',
    components: { Header, Content },
    data: ()=> ({ user })
  }
</script>

<template>
  <div>
    <Header v-if="user.id" />
    <Content>
      <router-view />
    </Content>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
</style>
