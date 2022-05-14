<script>
  import { computed } from 'vue'
  import { useQuery, useSession } from 'helpers'
  import { CardGame } from 'components'

  export default {
    name: 'gamer',
    components: { CardGame },
    setup() {
      const session = useSession()

      const gamesQuery = {
        $or: [
          { status: 'pending', $where: 'this.userIds.length < 2' },
          { userIds: session.value?.user?.id }
        ]
      }
      const games = computed(()=> useQuery('games', gamesQuery))

      return { games }
    }
  }
</script>

<template>
  <CardGame
    :class="gpCard"
    v-for="game in games.value"
    :key="game.id"
    :game="game"
  />
</template>
