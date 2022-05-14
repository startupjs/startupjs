<script>
  import { useSession } from 'helpers'
  import Professor from './Professor'
  import Gamer from './Gamer'

  export default {
    name: 'games',
    components: { Professor, Gamer },
    setup() {
      return { session: useSession() }
    }
  }
</script>

<template>
  <Professor v-if="session.user.type === 'professor'" />
  <Gamer v-if="session.user.type === 'gamer'" />
</template>
