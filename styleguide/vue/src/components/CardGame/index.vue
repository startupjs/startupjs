<script>
  import { computed } from 'vue'
  import { useDoc } from 'helpers'
  import dayjs from 'dayjs'

  export default {
    name: 'card-game',
    props: { game: Object },
    setup({ game }) {
      const auhtor = useDoc('users', game?.auhtorId)

      function onClose () {
        alert('onClose')
      }

      return {
        auhtor,
        date: dayjs(game.createdAt).format('YYYY.MM.DD HH:mm'),
        onClose
      }
    }
  }
</script>

<template>
  <n-card
    :class="$style.cgCard"
    :title="game.name"
  >
    <div>Created: {{ date }}</div>
    <div v-if="auhtor">{{ auhtor.email }}</div>
    <div>status: {{game.status}}</div>
    <div>Number of players: {{ game.userIds.length }}</div>

    <div :class="$style.cgActions">
      <n-button
        :class="$style.cgButton"
        @click="$router.push(`/game/${game.id}`)"
      >Join</n-button>
    </div>
  </n-card>
</template>

<style module>
  .cgActions {
    margin-top: 16px;
  }

  .cgCard {
    min-width: 240px;
    min-height: 240px;
  }

  .cgButton {
    margin-right: 8px;
  }
</style>
