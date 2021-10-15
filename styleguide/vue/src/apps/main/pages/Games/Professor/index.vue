<script>
  import { computed } from 'vue'
  import { useQuery, useSession } from 'helpers'
  import { CardGame } from 'components'

  export default {
    name: 'professor',
    components: { CardGame },
    setup() {
      const session = useSession()

      const gamesQuery = { auhtorId: session?.value?.user?.id }
      const games = computed(()=> useQuery('games', gamesQuery))

      return { session, games }
    }
  }
</script>

<template>
  <n-button @click="$router.push('/games/create')">Create game</n-button>

  <div :class="$style.gpList">
    <CardGame
      :key="game.id"
      :class="gpCard"
      v-for="game in games.value"
      :game="game"
    />
  </div>
</template>

<style module>
  .gpList {
    margin-top: 16px;
    display: flex;
  }
  .gpCard {
    margin-right: 16px;
  }
</style>
