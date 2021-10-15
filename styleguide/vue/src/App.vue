<script>
  import { onBeforeMount } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { initSession, useSession } from 'helpers'

  export default {
    name: 'app',
    setup() {
      const session = useSession()
      const router = useRouter()
      const route = useRoute()

      onBeforeMount(async ()=> {
        await initSession()

        if (route.meta.isAuth && !session.value.user) {
          return router.push({ name: 'sign-in' })
        }

        if (!route.meta.isAuth && session.value.user) {
          return router.push({ name: 'games' })
        }
      })

      return { session }
    }
  }
</script>

<template>
  <router-view v-if="session" />
  <div v-else :class="$style.loader">
    <n-spin size="large" />
  </div>
</template>

<style module>
  * {
    margin: 0;
    padding: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .loader {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }
</style>
